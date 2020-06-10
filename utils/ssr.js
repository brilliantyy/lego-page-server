
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
            const sdk = prepareThirdPartySDK(data)
            const thirdStyles = prepareThirdPartyStyles(data)
            const context = {
                url,
                pageData,
                sdk,
                thirdStyles,
                __Vue__: Vue,
                title: data.pageConfig.title,
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

function prepareThirdPartySDK(data) {
    let thirdPartySDK = ''
    if (needsSwiperSDK(data)) {
        thirdPartySDK = `${thirdPartySDK}
        <script type="text/javascript" src="/javascripts/swiper.min.js"></script>`
    }

    return thirdPartySDK
}

function prepareThirdPartyStyles(data) {
    let links = ''
    if (needsSwiperSDK(data)) {
        links = `${links}
        <link rel="stylesheet" type="text/css" href="/stylesheets/swiper.min.css">`
    }

    return links
}

function needsSwiperSDK(pageData) {
    const { components } = pageData
    if (!!components.length) {
        const nums = components.filter(cmp => cmp.name.indexOf('carousel') > -1).length
        if (nums > 0) {
            return true
        }
    }
    return false
}

module.exports = {
    renderPage
}