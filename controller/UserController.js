const oracleService = require('../service/oracelQuery.service');
const dateUtil = require('../util/dateConvert.util');
const common_service = require('../service/common.service');

exports.insertUser = async function (req, res) {
    let username = req.body.username;
    let password = Buffer.from((dateUtil.timeStamp() + req.body.password).toString('base64'));
    let bankCode = req.body.bankCode;
    let sysdate = dateUtil.timeStamp();
    let optionCommit = {autoCommit: true};
    let INSERT = "INSERT INTO TB_ITUSER(USER_NM, USER_PW, INOUT_GB, CUST_CD, SYS_DTIM) VALUES (:USER_NM, :USER_PW, :INOUT_GB, :CUST_CD, :SYS_DTIM)";
    let values = [username, password, '2', bankCode, sysdate];
    await oracleService(res, INSERT, values, optionCommit);
    
};

exports.redirectUser = async function(req, res) {
    res.redirect('https://localhost:4200/banks');
}

exports.insertINQLog = async function (req, res) {
    let niceSessionKey;
    let sysdate = dateUtil.timeStamp();
    let optionCommit = {autoCommit: true};

    await common_service.getSequence().then(resSeq => {
        niceSessionKey = dateUtil.timeStamp2() + resSeq[0].SEQ;
    })

    let INSERT = 'INSERT INTO TB_INQLOG (INQ_LOG_ID, CUST_CD, TX_GB_CD, NATL_ID, AGR_FG, SYS_DTIM)'
    let VALUES = ' VALUES (:INQ_LOG_ID, :CUST_CD, :TX_GB_CD, :NATL_ID, :AGR_FG, :SYS_DTIM)'
    let sql = INSERT + VALUES;
    let values = [niceSessionKey, req.body.fiCode, req.body.taskCode, req.body.natId, req.body.infoProvContent, sysdate];
    await oracleService(res, sql, values, optionCommit);
}

exports.insertSCRPLog = async function (req, res) {
    let niceSessionKey;
    let sysdate = dateUtil.timeStamp();
    let optionCommit = {autoCommit: true};

    await common_service.getSequence().then(resSeq => {
        niceSessionKey = 'S1003' + dateUtil.timeStamp2() + resSeq[0].SEQ;
    })

    let INSERT = 'INSERT INTO TB_SCRPLOG (NICE_SSIN_ID, CUST_CD, LOGIN_ID, NATL_ID, AGR_FG, SYS_DTIM)'
    let VALUES = ' VALUES ( :NICE_SSIN_ID, :CUST_CD, :LOGIN_ID, :NATL_ID, :AGR_FG, :SYS_DTIM)'
    let sql = INSERT + VALUES;
    let values = [niceSessionKey, req.body.fiCode, req.body.name, req.body.natId, req.body.infoProvContent, sysdate];
    await oracleService(res, sql, values, optionCommit);
}
