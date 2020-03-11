const oracledb = require('oracledb');
const dbconfig = require('../config/auth');


async function checkPhone(res, sql, param, option) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbconfig);
        let result = await connection.execute(
            sql, param, option);
        if (result.rows !== undefined) {
            res.status(200).send({data: result.rows});
        } else {
            res.status(500).send({message: "Phone Number does not exist/ Không tìm thấy số điện thoại"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Problem with server");
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                res.status(500).send("Problem with closing connection");
            }
        }
    }
}

module.exports = checkPhone;
