const mysql = require('mysql')
const { MYSQL_CONF } = require('../config/db')

const conn = mysql.createConnection(MYSQL_CONF)

conn.connect()

function exec(sql) {
    const promise = new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if (err) {
                reject(err)
            }
            resolve(result)
        })
    })
    return promise
}

module.exports = {
    exec
}