const env = process.env.NODE_ENV

let MYSQL_CONF

if (env === 'dev') {
    MYSQL_CONF = {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '',
        database: 'page_maker'
    }
}
if (env === 'production') {
    MYSQL_CONF = {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '',
        database: 'page_maker'
    }
}

module.exports = {
    MYSQL_CONF
}