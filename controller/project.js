const { exec } = require('../db/mysql')

const getList = (creatorId) => {
    const sql = `select * from pages where page_creator=${creatorId}`

    return exec(sql)
}

const getDetailWithCreatorId = (creatorId, projectId) => {
    const sql = `select * from pages where page_id=${projectId} and page_creator=${creatorId}`

    return exec(sql)
}

const getDetail = (projectId) => {
    const sql = `select * from pages where page_id=${projectId}`

    return exec(sql)
}

const updateDetail = (projectId, title, content, isDraft, creatorId, renderType, url = '') => {
    const sql = `update pages set page_name='${title}', page_content='${content}', is_draft=${isDraft}, render_type='${renderType}', page_url='${url}' where page_id=${projectId} and page_creator=${creatorId}`

    return exec(sql)
}

const create = (title, url, creatorId, content, type, isDraft) => {
    const sql = `insert into pages (page_name, page_url, page_creator, page_content, page_type, is_draft) values('${title}', '${url}', ${creatorId}, '${content}', ${type}, ${isDraft})`

    return exec(sql)
}

const genTemplatePage = (projectId, content) => {

}

module.exports = {
    getList,
    getDetail,
    getDetailWithCreatorId,
    updateDetail,
    create
}