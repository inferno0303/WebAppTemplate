// axios的默认配置
axios.defaults.baseURL = 'http://127.0.0.1:8888';
axios.defaults.withCredentials = true;

// 定义Vue组件
const App = {

    data() {
        return {
            userInfo: { username: "正在获取", password: "********", role: "", gender: "男", enable: "1", email: "1234567890@github.com", phone: "1234567890", last_login_time: "1234567890", create_time: "1234567890", avatar: null },
            isEdit: false
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