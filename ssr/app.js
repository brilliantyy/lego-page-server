const Vue = require('vue')
const fs = require('fs')
const path = require('path')
const VueRenderer = require('vue-server-renderer')
const { register, transformCss } = require('./register')

const template = fs.readFileSync(path.join(__dirname, './index.template.html'), 'utf-8')
const renderer = VueRenderer.createRenderer({ template })

register(Vue)

async function renderPage(components) {
    let children = []
    const firstPageComponents = components.filter(c => Number(c.css.top) + Number(c.css.height) / 2 <= 667)
    firstPageComponents.forEach(data => {
        const CmpConstructor = Vue.component(data.name)

        if (typeof CmpConstructor === 'function') {
            const cmpInstance = new CmpConstructor({
                propsData: {
                    id: data.id,
                    css: transformCss(data.css),
                    options: data.options
                }
            })
            children.push(cmpInstance)
            console.log('name: ',cmpInstance.$options.name)
        }
    })

    const { app } = createApp({ children })

    return await renderToString(app)
}

function renderToString(app) {
    return new Promise((resolve, reject) => {
        renderer.renderToString(app, (err, html) => {
            if (err) reject()

            resolve(html)
        })
    })
}

function createApp({ children }) {
    const app = new Vue({
        data() {
            return {
                children
            }
        },
        template: `
            <div id="lego-app">
                <component :is="child.$options.name" v-for="child in children"
                    :key="child.$options.propsData.id"
                    :id="child.$options.propsData.id"
                    :css="child.$options.propsData.css"
                    :options="child.$options.propsData.options"></component>
            </div>
        `
    })
    return { app }
}

module.exports = {
    renderPage,
    createApp
}