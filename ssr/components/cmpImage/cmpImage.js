const component = {
    name: 'cmp-image',
    template: '<img class="cmp-image" :src="options.url" :style="css">',
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