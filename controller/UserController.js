const oracleService = require('../service/oracelQuery.service');
const dateUtil = require('../util/dateConvert.util');
const common_service = require('../service/common.service')
const cicMacrRQSTReq = require('../domain/CIC_MACR_RQST.request')
const cicMobileService = require('../service/cicMobile.service');
const validRequest = require('../util/validateMacrParamRequest');
const validation = require('../util/validation');
const PreResponse = require('../domain/preResponse.response');
const cicMacrRQSTRes = require('../domain/CIC_MACR_RQST.response');
const validS11AService = require('../service/validS11A.service');
const responcodeEXT = require('../constant/responseCodeExternal');


exports.insertUser = async function (req, res) {
    let username = req.body.username;
    let password = Buffer.from((dateUtil.timeStamp() + req.body.password).toString('base64'));
    let bankCode = req.body.bankCode;
    let sysdate = dateUtil.timeStamp();
    console.log('something');
    let optionCommit = { autoCommit: true };
    let INSERT = "INSERT INTO TB_ITUSER(USER_NM, USER_PW, INOUT_GB, CUST_CD, SYS_DTIM) VALUES (:USER_NM, :USER_PW, :INOUT_GB, :CUST_CD, :SYS_DTIM)";
    let values = [username, password, '2', bankCode, sysdate];
    await oracleService(res, INSERT, values, optionCommit);

};

exports.insertSCRLog = async function (req, res) {
    try {
        let niceSessionKey;
        let preResponse, responseData;

        /*
        Checking parameters request
        Request data
        */
        let rsCheck = validRequest.checkMacrParamRequest(req.body);

        if (!validation.isEmptyJson(rsCheck)) {
            preResponse = new PreResponse(rsCheck.responseMessage, '', dateUtil.timeStamp(), rsCheck.responseCode);

            let responseData = new cicMacrRQSTRes(req.body, preResponse);
            return res.status(200).json(responseData);
        }
        validS11AService.selectFiCode(req.body.fiCode, responcodeEXT.NiceProductCode.Mobile.code).then(dataFICode => {
            if (_.isEmpty(dataFICode)) {
                preResponse = new PreResponse(responcodeEXT.RESCODEEXT.InvalidNiceProductCode.name, '', dateUtil.timeStamp(), responcodeEXT.RESCODEEXT.InvalidNiceProductCode.code);

                responseData = new cicMacrRQSTRes(req.body, preResponse);
                return res.status(200).json(responseData);
            }
            //End check params request

            common_service.getSequence().then(resSeq => {
                niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;


                const getdataReq = new cicMacrRQSTReq(req.body, niceSessionKey);
                //JSON.stringify(getdataReq);
                console.log("getdataReq = ", getdataReq);

                //logging request
                logger.debug('log request parameters from routes after manage request');
                logger.info(getdataReq);

                cicMobileService.insertINQLOG(getdataReq, res).then(res1 => {
                    console.log('insertINQLOG:', res1)
                    cicMobileService.insertSCRPLOG(getdataReq, res).then(niceSessionK => {
                        console.log("result cicMacrRQST: ", niceSessionK);

                        let responseSuccess = new PreResponse(responcodeEXT.RESCODEEXT.INPROCESS.name, niceSessionK, dateutil.timeStamp(), responcodeEXT.RESCODEEXT.INPROCESS.code);
                        let responseUnknow = new PreResponse(responcodeEXT.RESCODEEXT.UNKNOW.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.UNKNOW.code);

                        if (!validation.isEmptyStr(niceSessionK)) {
                            let responseData = new cicMacrRQSTRes(getdataReq, responseSuccess);
                            return res.status(200).json(responseData);
                        } else {
                            let responseData = new cicMacrRQSTRes(getdataReq, responseUnknow);
                            return res.status(400).json(responseData);
                        }
                    });
                });
            });
        });

    } catch (err) {
        return next(err);
    }
}

exports.redirectUser = async function (req, res) {
    res.redirect('https://localhost:4200/banks');
}
