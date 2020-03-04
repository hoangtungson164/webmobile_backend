require('dotenv').config();
const oracledb = require('oracledb');
const oracleService = require('../service/oracelQuery.service');
const url = process.env.CICB_URL;

var optionSelect = { outFormat: oracledb.OUT_FORMAT_OBJECT };
var params = {}

exports.cicbAPI = async function(req, res) {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
        // timeout: 6000
    }

    axios.post(url, req.body, config).then((body) => {
        console.log("doing something with data");
    }).catch((err) => {
        console.log("Catch if something when wrong");
    })
}