const { exec } = require('../db/mysql')

const saveImage = (path) => {
    const sql = `insert into pictures(pic_path) values(${path})`
    return exec(sql)
}