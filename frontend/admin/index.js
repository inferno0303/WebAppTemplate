// axios的默认配置
axios.defaults.baseURL = 'http://127.0.0.1:8888';
axios.defaults.withCredentials = true;

// 定义Vue组件
const App = {

    data() {
        return {
            // 用户总数：被分页器total属性绑定
            userCount: 0,
            // 每页显示的个数：被分页器default-page-size属性绑定
            defaultPageSize: 10,
            // 当前页数：被分页器current-page属性绑定，默认值1
            currentPage: 1,

            // 用户列表
            userList: []
        };
    },

    computed: {

    },

    methods: {

        // 请求用户数量
        async http_getUserCount() {
            await axios.get("/admin_get_user_count")
                .then(response => {
                    if (!response.data.code === 200)
                        return -1;
                    this.userCount = response.data.data;
                })
                .catch(err => { })
        },

        // 请求用户列表，会根据当前分页器选中的页码，以及每页显示的数量请求
        async http_getUserList() {
            await axios.get("/admin_get_user_list", {
                params: {
                    limit: this.defaultPageSize,
                    offset: (this.currentPage - 1) * this.defaultPageSize + 1
                }
            })
                .then(response => {
                    if (!response.data.code === 200)
                        return -1;
                    this.userList = response.data.data;
                })
                .catch(err => { })
        },

        // 点击分页器页码
        async onClick_currentChange(number) {
            await this.http_getUserCount();
            await this.http_getUserList();
            // 平滑滚动到页面顶端
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

    },

    async mounted() {
        await this.http_getUserCount();
        await this.http_getUserList();
    }
};

const app = Vue.createApp(App)
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount("#app");