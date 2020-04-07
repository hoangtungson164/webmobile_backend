const oracleService = require('../service/oracelQuery.service');
const dateUtil = require('../util/dateConvert.util');
const common_service = require('../service/common.service');
const checkPhoneService = require('../service/checkPhone.service');
const oracledb = require('oracledb');
var optionSelect = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const _ = require('lodash');

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

exports.checkExistPhoneNumberAndCustCD = async function (req, res) {
    let phoneNumber = req.body.phoneNumber;
    let _lisCustCD = req.body.lisCustCD;
    let lisCustCD = [];
    _.forEach(_lisCustCD, val => {
        lisCustCD.push(val.CUST_CD);
    });
    let SQL_SELECT = "SELECT NICE_SSIN_ID,SCRP_MOD_CD,SCRP_STAT_CD,CUST_CD ";
    let SQL_FROM = "FROM TB_SCRPLOG ";
    let SQL_WHERE = `WHERE TEL_NO_MOBILE = :phoneNumber AND CUST_CD IN (${lisCustCD.map((name, index) => `'${name}'`).join(", ")}) `;
    let SQL_ORDER_BY = `ORDER BY CASE WHEN TB_SCRPLOG.SYS_DTIM IS NOT NULL THEN 1 ELSE 0 END DESC, TB_SCRPLOG.INQ_DTIM DESC `;
    let sql = SQL_SELECT + SQL_FROM + SQL_WHERE + SQL_ORDER_BY;
    let params = {
        phoneNumber,
    };
    let listNiceSS = await checkPhoneService(res, sql, params, optionSelect);
    if (listNiceSS[0]) {
        res.status(200).send(convertNiceSesionKey(listNiceSS));
    } else {
        res.status(200).send(listNiceSS);
    }
};

exports.updateIdAndPWAndNationIDToSracpLog = async function(req, res) {
  let niceSsKey = req.body.niceSsKey;
  let loginID = req.body.loginID;
  let loginPW = req.body.loginPW;
  let nationID = req.body.nationID;
  let listNiceSsKey = [];

    _.forEach(niceSsKey, val => {
        listNiceSsKey.push(val.NICE_SSIN_ID);
    });
  let optionCommit = {autoCommit: true};
  let SQL_UPDATE = `UPDATE TB_SCRPLOG SET LOGIN_ID = :loginID , LOGIN_PW = :loginPW , NATL_ID = :nationID , SCRP_MOD_CD = '06' WHERE NICE_SSIN_ID IN (${listNiceSsKey.map((name, index) => `'${name}'`).join(", ")}) `;
  let params = {
      loginID,
      loginPW,
      nationID
  };
    await oracleService(res, SQL_UPDATE, params, optionCommit);
};

exports.CheckNiceSsKeyValidToUpdate = async function (req, res) {
    let listNiceSskey = req.body.listNiceSskey;
    let SQL_CHECK = `SELECT NICE_SSIN_ID FROM TB_SCRPLOG WHERE NICE_SSIN_ID IN (${listNiceSskey.map((name, index) => `'${name}'`).join(", ")}) AND SCRP_MOD_CD = '05' AND SCRP_STAT_CD = '01' `;
    let params = {};
    await oracleService(res, SQL_CHECK, params, optionSelect);

};

exports.redirectUser = async function(req, res) {
    // res.redirect('https://103.112.124.153:4201/banks');
    // res.redirect('https://103.112.124.129:4201/banks');
    // res.redirect('https://localhost:4201/banks');
    res.redirect('https://103.112.124.129:4200/banks');
};

exports.insertINQLog = async function (req, res) {
    let niceSessionKey;
    let sysdate = dateUtil.timeStamp();
    let optionCommit = {autoCommit: true};

    await common_service.getSequence().then(resSeq => {
        niceSessionKey = dateUtil.timeStamp2() + resSeq[0].SEQ;
    });

    let INSERT = 'INSERT INTO TB_INQLOG (INQ_LOG_ID, CUST_CD, TX_GB_CD, NATL_ID, AGR_FG, SYS_DTIM)';
    let VALUES = ' VALUES (:INQ_LOG_ID, :CUST_CD, :TX_GB_CD, :NATL_ID, :AGR_FG, :SYS_DTIM)';
    let sql = INSERT + VALUES;
    let values = [niceSessionKey, req.body.fiCode, req.body.taskCode, req.body.natId, req.body.infoProvContent, sysdate];
    await oracleService(res, sql, values, optionCommit);
};

exports.insertSCRPLog = async function (req, res) {
    let niceSessionKey;
    let sysdate = dateUtil.timeStamp();
    let optionCommit = {autoCommit: true};

    await common_service.getSequence().then(resSeq => {
        niceSessionKey = 'S1003' + dateUtil.timeStamp2() + resSeq[0].SEQ;
    });

    let INSERT = 'INSERT INTO TB_SCRPLOG (NICE_SSIN_ID, CUST_CD, LOGIN_ID, NATL_ID, AGR_FG, SYS_DTIM)';
    let VALUES = ' VALUES ( :NICE_SSIN_ID, :CUST_CD, :LOGIN_ID, :NATL_ID, :AGR_FG, :SYS_DTIM)';
    let sql = INSERT + VALUES;
    let values = [niceSessionKey, req.body.fiCode, req.body.name, req.body.natId, req.body.infoProvContent, sysdate];
    await oracleService(res, sql, values, optionCommit);
};


function convertNiceSesionKey(data){
    const resGroup = _.groupBy(data, "CUST_CD");
    const result = [];
    console.log('resGroup:' + resGroup);
    _.forEach(resGroup, val =>{
        result.push(val[0]);
    });

    return result;
}
