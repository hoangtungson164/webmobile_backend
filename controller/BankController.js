const oracledb = require('oracledb');
const oracleService = require('../service/oracelQuery.service');

var optionSelect = { outFormat: oracledb.OUT_FORMAT_OBJECT };
var params = {};


exports.getAllBank = async function (req, res) {
    let SELECT = "SELECT TB_ITCUST.CUST_GB, TB_ITCUST.CUST_CD, TB_ITCUST.CUST_NM_ENG FROM TB_ITCUST";
    let JOIN = " JOIN TB_ITCTRT ON TB_ITCUST.CUST_GB = TB_ITCTRT.CUST_GB AND TB_ITCUST.CUST_CD = TB_ITCTRT.CUST_CD";
    let WHERE = " WHERE TB_ITCTRT.GDS_CD = 'S1003' AND TB_ITCUST.STATUS = 1 AND TB_ITCTRT.STATUS = 1 ";
    let ORDER = " ORDER BY TB_ITCUST.CUST_NM_ENG";
    let sql = SELECT + JOIN + WHERE + ORDER;
    await oracleService(res, sql, params, optionSelect);
};

exports.getAllConsensus = async function (req, res) {
    let custGb = req.query.custGb;
    let custCd = req.query.custCd;
    let SELECT = "SELECT TO_CHAR(COLLECTION), TO_CHAR(DATA_USING), TO_CHAR(PROVIDING), TO_CHAR(COLLECTION_VI), TO_CHAR(DATA_USING_VI), TO_CHAR(PROVIDING_VI) FROM TB_CONSENT_TYPE";
    let WHERE = " WHERE CUST_GB = :custGb AND CUST_CD = :custCd";
    let sql = SELECT + WHERE;
    let param = {
        custGb,
        custCd
    };
    await oracleService(res, sql, param, optionSelect);
};

exports.getAllReport = async function (req, res) {
    let custGb = req.query.custGb;
    let custCd = req.query.custCd;
    let SELECT = "SELECT*FROM TB_REPORT";
    let JOIN = " JOIN TB_CUST_REPORT ON TB_REPORT.REPORT_CODE = TB_CUST_REPORT.REPORT_CODE";
    let WHERE = " WHERE TB_CUST_REPORT.CUST_GB = :custGb AND TB_CUST_REPORT.CUST_CD = :custCd";
    let param = {
        custGb,
        custCd
    };
    let sql = SELECT + JOIN + WHERE;
    await oracleService(res, sql, param, optionSelect);
};

