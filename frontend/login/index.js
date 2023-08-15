// 定义Vue组件
const App = {
    data() {
        return {
            title: "XX管理系统",
            username: "",
            password: "",
            loading: false,
            currentUser: {"username": null, "role": null, "last_login_time": null},
            isLogin: false,
        };
    },
    computed: {
        isLoginBtnEnable() {
            return this.username !== '' && this.password !== '';
        },
    },
    methods: {
        // 登录请求
        async loginBtnClick() {
            this.loading = true;
            await axios({
                method: "POST",
                url: "/login",
                data: {"username": this.username, "password": this.password},
                withCredentials: true
            }).then(async resp => {
                if (resp.data.code === 200) {
                    ElementPlus.ElMessage({
                        message: resp.data.message,
                        type: 'success',
                    });
                    this.currentUser.username = resp.data.data.username;
                    this.currentUser.role = resp.data.data.role;
                    this.currentUser.last_login_time = resp.data.data.last_login_time;
                    this.linkToHome(this.currentUser.role);
                } else {
                    ElementPlus.ElMessage({
                        message: resp.data.message,
                        type: 'error',
                    });
                    this.password = "";
                }
            }).catch(err => {
                ElementPlus.ElMessage({
                    message: err,
                    type: 'error',
                });
            });
            this.loading = false;
        },
        // 检查当前cookie是否有效
        async checkLoginStatus() {
            await axios({
                method: "GET",
                url: "/check_login_status",
                withCredentials: true
            }).then(resp => {
                if (resp.data.code === 200) {
                    this.currentUser.username = resp.data.data.username;
                    this.currentUser.role = resp.data.data.role;
                    this.currentUser.last_login_time = resp.data.data.last_login_time;
                    this.isLogin = true;
                } else if (resp.data.code === 403) {
                    this.isLogin = false;
                }
            })
        },
        // 注销请求
        async logoutBtnClick() {
            await axios({
                method: "GET",
                url: "/logout",
                withCredentials: true
            }).then(async resp => {
                if (resp.data.code === 200) {
                    await this.checkLoginStatus();
                    ElementPlus.ElMessage({
                        message: "已注销登录",
                        type: 'warning',
                    });
                }
            })
        },
        // 前往各自的首页
        async linkToHome(role) {
            const currentURL = window.location.href;
            const baseURL = currentURL.substring(0, currentURL.lastIndexOf("/"));
            if (role === "user") {
                location.href = baseURL + "/user.html"
            } else if (role === "admin") {
                location.href = baseURL + "/admin.html"
            }
        },
        // 前往注册账户
        async linkToSignUp() {
            const currentURL = window.location.href;
            const baseURL = currentURL.substring(0, currentURL.lastIndexOf("/"));
            location.href = baseURL + "/sign_up.html"
        }
    },
    async mounted() {
        await this.checkLoginStatus();
    }
};
const app = Vue.createApp(App)
app.use(ElementPlus);
app.component('User', ElementPlusIconsVue.User);
app.component('Lock', ElementPlusIconsVue.Lock);
app.mount("#app");