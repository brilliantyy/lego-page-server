const fs = require('fs')
const path = require('path')

const getAllComponents = (dir, components=[]) => {
    const files = fs.readdirSync(dir)
    files.forEach((file) => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        if (stat.isDirectory()) {
            getAllComponents(filePath, components)
        } else {
            components.push(require(`${filePath}`))
        }
    })
    return components
}

const register = (Vue) => {
    const components = getAllComponents(path.join(__dirname, './components'))
    components.forEach(component => {
        Vue.use(component)
    })
}

const transformCss = (cssObj) => {
    const attrs = [
        'width', 'height', 'left', 'top', 'bottom', 'right', 'borderWidth', 'borderRadius', 'fontSize', 'lineHeight', 'letterSpacing',
        'paddingTop', 'paddingLeft', 'paddingBottom', 'paddingRight', 'marginTop', 'margiLeft', 'marginBottom', 'marginRight', 'slideWidth'
    ]
    const rootFontSize = 37.5
    const copyCssObj = Object.assign({}, cssObj)

    Object.keys(copyCssObj).forEach(key => {
        if (attrs.includes(key)) {
            copyCssObj[key] = `${parseFloat(copyCssObj[key]/rootFontSize).toFixed(2)}rem`
        }
    })
    copyCssObj.position = 'absolute'
    return copyCssObj
}

module.exports = {
    register,
    transformCss
}