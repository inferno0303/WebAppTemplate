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

        // 按钮是否可被点击
        isLoginBtnEnable() {
            return this.username !== '' && this.password !== '';
        },
    },

    methods: {

        // 点击按钮，注册
        onClick_registerBtn() {
            alert("hello world");
        },

        // 发起http请求，检查登录状态
        async http_checkLoginStatus() {
            ElementPlus.ElMessage({
                message: "http_checkLoginStatus",
                type: 'error',
            });
        },

        // 按下登录按钮
        async onClick_loginBtn() {
            this.loading = true;
            await axios({
                method: "POST",
                url: "/login",
                data: {"username": this.username, "password": this.password},
                withCredentials: true
            })
                .then(async resp => {
                    if (resp.data.code === 200) {

                    } else {

                    }
                })
            this.loading = false;
        },

        // 点击按钮，登录
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
        // async checkLoginStatus() {
        //     await axios({
        //         method: "GET",
        //         url: "/check_login_status",
        //         withCredentials: true
        //     }).then(resp => {
        //         if (resp.data.code === 200) {
        //             this.currentUser.username = resp.data.data.username;
        //             this.currentUser.role = resp.data.data.role;
        //             this.currentUser.last_login_time = resp.data.data.last_login_time;
        //             this.isLogin = true;
        //         } else if (resp.data.code === 403) {
        //             this.isLogin = false;
        //         }
        //     })
        // },

        // 按下按钮，注销
        async onClick_logoutBtn() {
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

        // 私有，前往各自的首页
        async _linkToHome(role) {
            const currentURL = window.location.href;
            const baseURL = currentURL.substring(0, currentURL.lastIndexOf("/"));
            if (role === "user") {
                location.href = baseURL + "/user.html"
            } else if (role === "admin") {
                location.href = baseURL + "/admin.html"
            }
        },

        // 事件，前往注册账户
        async onCLick_linkToSignUp() {
            const currentURL = window.location.href;
            const baseURL = currentURL.substring(0, currentURL.lastIndexOf("/"));
            location.href = baseURL + "/sign_up.html"
        }
    },

    async mounted() {
        await this.http_checkLoginStatus();
    }
};
const app = Vue.createApp(App)
app.use(ElementPlus);
app.component('User', ElementPlusIconsVue.User);
app.component('Lock', ElementPlusIconsVue.Lock);
app.mount("#app");