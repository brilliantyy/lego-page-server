const express = require('express')
const path = require('path')
const fs = require('fs')
const router = express.Router()

router.get('/banner', (req, res, next) => {
    fs.readdir(path.join(__dirname, '../public/images/ad'), (err, files) => {
        if (err) {
            res.json({ code: -1, msg: '数据不存在', data: []})
        }
        const list = files.map(fileName => `http://localhost:3000/images/ad/${fileName}`)
        res.json({ code: 0, msg: '请求成功', data: list })
    })
})

module.exports = router;
