const express = require('express')
const router = express.Router()
const multer = require('multer')
const crypto = require('crypto')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname)
    }
})
  

const uploader = multer({ storage })
const picPath = `http://localhost:3000/images/`

router.post('/image', uploader.single('file'), (req, res, next) => {
    const image = req.file
    const hash = crypto.createHash('md5')
    fs.readFile(image.path, (err, data) => {
        if (err) {
            console.log('图片上传失败')
            return
        }
        hash.update(data)
        const hashName = hash.digest('hex')

        fs.readdir(path.join(__dirname, '../public/images'), (err, files) => {
            if (err) return

            for (let i = 0, len = files.length; i < len; i++) {
                if (hashName === files[i].slice(0, files[i].lastIndexOf('.'))) {
                    res.json({
                        code: 0,
                        msg: '图片上传成功',
                        data: {
                            url: `${picPath}${files[i]}`
                        }
                    })
                    return
                }
            }

            const originalName = image.originalname
            const idx = originalName.lastIndexOf('.')
            const name = `${hashName}${originalName.slice(idx)}`

            fs.writeFile(path.join(__dirname, `../public/images/${name}`), data, err => {
                if (err) {
                    console.log('图片写入失败', name, err)
                    res.json({ code: -1, msg: '图片上传失败'})
                    return
                }
                
                res.json({
                    code: 0,
                    msg: '图片上传成功',
                    data: {
                        url: `${picPath}${name}`
                    }
                })
                return
            })
        })
    })
})

module.exports = router