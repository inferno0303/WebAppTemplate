// axios配置
axios.defaults.baseURL = 'http://127.0.0.1:8888';
axios.defaults.withCredentials = true;
axios.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    // 如果收到 HTTP 403 响应就回到登录页
    if (error.response.status === 403) {
        ElementPlus.ElMessage({ message: "您的登录状态已经失效，请重新登录", type: 'warning' });
        // 等待2秒
        await new Promise((resolve) => {
            setTimeout(() => resolve(), 2000);
        });
        // 跳转到登录页
        const currentDomain = new URL(window.location.href).origin;
        window.location.href = currentDomain + "/login/";
    }
    return Promise.reject(error);
});

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
        },

        // 启用或封禁账户
        async onClick_enableDisableAccount(user, enable) {
            await axios.get("/admin_enable_disable_account", {
                params: {
                    username: user.username,
                    enable: enable
                }
            })
                .then(async response => {
                    if (!response.data.code === 200)
                        return -1;
                    await this.http_getUserList();
                    ElementPlus.ElMessage({ message: response.data.message, type: 'success' });
                })
                .catch(err => { })
        },

        // 删除账户
        async onClick_deleteAccount(user) {
            await axios.get("/admin_delete_account", {
                params: {
                    username: user.username
                }
            })
                .then(async response => {
                    if (!response.data.code === 200)
                        return -1;
                    await this.http_getUserList();
                    ElementPlus.ElMessage({ message: response.data.message, type: 'success' });
                })
                .catch(err => { })
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