const component = {
    name: 'cmp-text',
    template: '<p class="cmp-text" :style="css">{{options.text}}</p>',
    data() {
        return {}
    },
    props: {
        css: {
            type: Object,
            default: () => {}
        },
        options: {
            type: Object,
            default: () => {}
        }
    }
}


module.exports = {
    install: (Vue) => {
        Vue.component(component.name, component)
    }
}