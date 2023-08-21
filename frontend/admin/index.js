// axios的默认配置
axios.defaults.baseURL = 'http://127.0.0.1:8888';
axios.defaults.withCredentials = true;

// 定义Vue组件
const App = {

    data() {
        return {
            
        };
    },

    computed: {

    },

    methods: {

    },

    async mounted() {
        
    }
};

const app = Vue.createApp(App)
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount("#app");