const express = require('express')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const router = express.Router()
const { renderPage } = require('../utils/ssr.js')
const { formatDate } = require('../utils')
const { getList, getDetail, getDetailWithCreatorId, updateDetail, create } = require('../controller/project')

const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`

router.get('/list', (req, res, next) => {
    getList(1).then(result => {
        let data
        if (result && result.length) {
            data = result.map(i => {
                return {
                    isDraft: 0,
                    id: i.page_id,
                    title: i.page_name,
                    content: i.page_content,
                    author: i.page_creator,
                    type: i.page_type,
                    createTime: formatDate(i.create_time),
                    updateTime: formatDate(i.update_time)
                }
            })
        } else {
            data = []
        }
        res.json({ code: 0, msg: '查询成功', data: data })
    }).catch(err => {
        res.json({ code: -1, msg: '查询失败' })
    })
})

router.post('/detail', (req, res, next) => {
    const { uid, id } = req.body
    if (!Number(uid) || !Number(+id)) {
        res.json({ code: -1, msg: '参数不合法' })
        return
    }
    getDetailWithCreatorId(uid, id).then(result => {
        if (result && result.length) {
            const data = {
                id: result[0].page_id,
                title: result[0].page_name,
                url: result[0].page_url,
                type: result[0].page_type,
                content: result[0].page_content,
                author: result[0].page_creator,
                createTime: result[0].create_time,
                updateTime: result[0].update_time,
                isDraft: result[0].is_draft
            }
            res.json({ code: 0, msg: '查询成功', data: data })
        }
    }).catch(err => {
        res.json({ code: -1, msg: '查询失败' })
    })
})

router.post('/save', (req, res, next) => {
    const { id, content, uid } = req.body
    if (id && Number(id)) {
        getDetailWithCreatorId(uid, id).then(result => {
            if (result && result.length) {
                try {
                    const { title, renderType } = JSON.parse(content).pageConfig
                    updateDetail(Number(id), title, content, 1, uid, renderType).then(result => {
                        if (result && result.affectedRows === 1) {
                            res.json({ code: 0, msg: '保存成功', data: { id: Number(id)} })
                        }
                    }).catch(err => {
                        res.json({ code: -1, msg: '保存失败' })
                    })
                } catch (error) {
                    res.json({ code: -1, msg: '数据格式错误' })
                }
            }
        }).catch(err => {
            res.json({ code: -1, msg: '项目ID不存在' })
        })
    } else {
        try {
            const { title, url } = JSON.parse(content)
            create(title, url, uid, content, 1, 1).then(result => {
                if (result.affectedRows === 1) {
                    res.json({ code: 0, msg: '保存成功', data: { id: result.insertId} })
                } else {
                    res.json({ code: -1, msg: '保存失败' })
                }
            }).catch(err => {
                res.json({ code: -1, msg: '保存失败' })
            })
        } catch (error) {
            res.json({ code: -1, msg: '数据格式错误' })
        }
        
    }
})

router.post('/preview', (req, res, next) => {
    const { id, content, uid } = req.body
    if (id && Number(id)) {
        const hash = crypto.createHash('md5')
        hash.update(`${id}`)
        const name = hash.digest('hex')
        fs.writeFile(path.join(__dirname, `../public/docs/temp/${name}.html`), content, (err) => {
            if (err) {
                res.json({ code: -1, msg: '预览失败，请稍后重试' })
                return
            }
            res.json({ code: 0, msg: '发布成功', data: { url: `http://localhost:3000/docs/temp/${name}.html` } })
        })
    } else {
        res.json({ code: -1, msg: '项目ID不合法' })
    }
})

router.post('/publish', (req, res, next) => {
    const { id, content, uid } = req.body
    if (id && Number(id)) {
        getDetailWithCreatorId(uid, id).then(result => {
            if (result && result.length) {

                
            }
            fs.writeFile(path.join(__dirname, `../public/docs/${id}.html`), content, (err) => {
                if (err) {
                    res.json({ code: -1, msg: '发布失败，请稍后重试' })
                    return
                }
                res.json({ code: -1, msg: '发布成功', data: { url: `http://localhost:3000/docs/${id}.html` } })
            })
        }).catch(err => {
            res.json({ code: -1, msg: '项目ID不存在' })
        })
    }
})

router.get('/active', (req, res, next) => {
    const { id } = req.query
    if (!Number(+id)) {
        res.json({ code: -1, msg: '参数不合法' })
        return
    }
    getDetail(id).then(result => {
        if (result && result.length) {
            const { render_type: renderType, page_content: content } = result[0]
        
            if (renderType === 1) {
                try {
                    // components.sort((a, b) => Number(a.css.top) - Number(b.css.top))
                    renderPage({ pageData: content, url: '' }).then(html => {
                        res.set('Content-Type', 'text/html')
                        res.setHeader('Server', serverInfo)
                        return res.end(html)
                    }).catch(err => {
                        console.log(1, err)
                        return res.status(500).json({ code: -1, msg: 'Internal Server Error' })
                    })
                } catch (err) {
                    console.log(2, err)
                    return res.status(500).json({ code: -1, msg: 'Internal Server Error' })
                }
            } else {
                return res.json({ code: 0, msg: '', data: {} })
            }
        } else {
            res.json({ code: -1, msg: '', data: {} })
        }
    }).catch(err => {
        res.json({ code: -1, msg: '查询失败' })
    })
})

module.exports = router;