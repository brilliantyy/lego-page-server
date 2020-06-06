const component = {
    name: 'cmp-carousel',
    template: `
        <div :style="wrapperStyle">
            <div class="swiper-container swiper-rotate" :id="id" :style="contentStyle">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item, index) in slides" :key="index" :style="slideStyle">
                        <img :src="item.url" :style="{ objectFit: css.objectFit }">
                    </div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
        </div>
    `,
    data() {
        return {
            instance: null,
            slides: this.options.items
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        },
        css: {
            type: Object,
            default: () => {}
        },
        options: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        wrapperStyle() {
            const { left, top, right, width, height, paddingLeft, paddingTop, paddingBottom, paddingRight,
                marginTop, marginLeft, marginBottom, marginRight, zIndex, borderColor, borderStyle, borderWidth, boxSizing } = this.css
            return { position: 'absolute', left, top, right, width, height, paddingLeft, paddingTop, paddingBottom, paddingRight,
                marginTop, marginLeft, marginBottom, marginRight, zIndex, borderColor, borderStyle, borderWidth, boxSizing }
        },
        contentStyle() {
            const { borderRadius, backgroundColor } = this.css
            return { height: '100%', borderRadius, backgroundColor }
        }
    },
    mounted() {
        this.init()
    },
    beforeDestroy() {
        this.instance.destroy()
    },
    methods: {
        init() {
            this.$nextTick(() => {
                const swiperOptions = {
                    loop: true,
                    autoplay: this.options.autoplay,
                    delay: this.options.delay,
                    speed: this.options.speed,
                    effect: this.options.effect,
                    pagination: {
                        el: '.swiper-pagination'
                    }
                }
                this.instance = new Swiper(`#${this.id}`, swiperOptions)
            })
        }
    }
}


module.exports = {
    install: (Vue) => {
        Vue.component(component.name, component)
    }
}