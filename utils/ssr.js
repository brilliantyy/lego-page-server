
const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const Vue = require('vue')
const resolve = file => path.resolve(__dirname, file)
const { createBundleRenderer } = require('vue-server-renderer')

function createRenderer (bundle, options) {
    return createBundleRenderer(bundle, Object.assign(options, {
        cache: new LRU({
            max: 1000,
            maxAge: 1000 * 60 * 15
        }),
        basedir: resolve('../dist')
    }))
}

const templatePath = resolve('../public/index.html')
const template = fs.readFileSync(templatePath, 'utf-8')
const bundle = require('../dist/vue-ssr-server-bundle.json')
const clientManifest = require('../dist/vue-ssr-client-manifest.json')
const renderer = createRenderer(bundle, {
    runInNewContext: false,
    template,
    clientManifest
})

function renderPage ({ url, pageData }) {
    return new Promise((resolve, reject) => {
        try {
            const data = JSON.parse(pageData)
            const context = {
                url,
                pageData,
                __Vue__: Vue,
                title: data.pageConfig.title
            }
            renderer.renderToString(context)
                .then(html => {
                    resolve(html)
                })
                .catch(err => {
                    reject(err)
                })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    renderPage
}