var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var BankController = require('../controller/BankController');
var UserController = require('../controller/UserController');

router.get('/checkPhoneNumber', UserController.checkExistPhoneNumberAndCustCD);
router.get('/', UserController.redirectUser);
router.get('/banks', BankController.getAllBank);
router.get('/banks/:id/consent', BankController.getAllConsensus);
router.get('/banks/:id/report', BankController.getAllReport);
router.post('/insertUser', UserController.insertUser);
router.post('/insertINQLog', UserController.insertINQLog);
router.post('/insertSCRPlog', UserController.insertSCRPLog);
router.put('/updateIdAndPwScrapLog', UserController.updateIdAndPWScapLogAndNationID);

module.exports = router
