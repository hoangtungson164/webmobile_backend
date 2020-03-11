const oracleService = require('../service/oracelQuery.service');
const dateUtil = require('../util/dateConvert.util');
const common_service = require('../service/common.service');
const checkPhoneService = require('../service/checkPhone.service');
const oracledb = require('oracledb');
var optionSelect = { outFormat: oracledb.OUT_FORMAT_OBJECT };

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

exports.checkExistPhoneNumber = async function(req, res) {
  let phoneNumber = req.query.phoneNumber;

  let SQL_SELECT = "SELECT NICE_SSIN_ID ";
  let SQL_FROM = "FROM TB_SCRPLOG ";
  let SQL_WHERE = "WHERE TEL_NO_MOBILE = :phoneNumber ";
  let SQL_ORDER_BY = `ORDER BY CASE WHEN TB_SCRPLOG.SYS_DTIM IS NOT NULL THEN 1 ELSE 0 END DESC, TB_SCRPLOG.INQ_DTIM DESC `;
  let sql = SQL_SELECT + SQL_FROM + SQL_WHERE + SQL_ORDER_BY;
  let params = {
    phoneNumber
  };
    await checkPhoneService(res, sql, params, optionSelect);
};

exports.updateIdAndPWScapLog = async function(req, res) {
  let niceSsKey = req.body.niceSsKey;
  let loginID = req.body.loginID;
  let loginPW = req.body.loginPW;

  let optionCommit = {autoCommit: true};
  let SQL_UPDATE = "UPDATE TB_SCRPLOG SET LOGIN_ID = :loginID , LOGIN_PW = :loginPW WHERE NICE_SSIN_ID = :niceSsKey";
  let params = {
      niceSsKey,
      loginID,
      loginPW
  };
    await oracleService(res, SQL_UPDATE, params, optionCommit);
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
