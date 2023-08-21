// axios的默认配置
axios.defaults.baseURL = 'http://127.0.0.1:8888';
axios.defaults.withCredentials = true;

// axios添加响应拦截器
axios.interceptors.response.use(function (response) {
    if (response.status === 200) {
        return response;
    } else if (response.status === 403) {
        alert("403拦截");
        return response;
    }
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

// 定义Vue组件
const App = {

    data() {
        return {
            title: "XX管理系统",
            loginBox: {"username": null, "password": null},
            LoginBtnLoading: false,
            currentUser: {"username": null, "role": null, "last_login_time": null},
            isLogin: false,

            // 注册对话框
            dialogVisible: false,
            register: {"username": null, "email": null, "password": null, "password_again": null},
            registerBtnLoading: false
        };
    },

    computed: {

        // 登录按钮是否可被点击
        isLoginBtnEnable() {
            return this.loginBox.username && this.loginBox.password;
        },

        // 注册按钮是否可被点击
        isRegisterBtnEnable() {
            // 必须输入这些表单内容
            return this.register.username && this.register.email && this.register.password && this.register.password_again && this.register.password === this.register.password_again;
        }
    },

    methods: {

        // 检查登录状态
        async http_checkLoginStatus() {
            await axios({
                method: "GET",
                url: "/check_login_status",
                withCredentials: true
            })
                .then(response => {
                    if (response.data.code === 200) {
                        this.currentUser.username = response.data.data.username;
                        this.currentUser.role = response.data.data.role;
                        this.currentUser.last_login_time = response.data.data.last_login_time;
                        this.isLogin = true;
                        ElementPlus.ElMessage({
                            message: "http_checkLoginStatus", type: 'success',
                        });
                    } else if (response.data.code === 403) {
                        this.isLogin = false;
                        ElementPlus.ElMessage({
                            message: "http_checkLoginStatus", type: 'message',
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                })

        },

        // 点击按钮，注册
        async onClick_registerBtn() {
            this.registerBtnLoading = true;
            // 校验数据
            if (this.register.password !== this.register.password_again) {
                ElementPlus.ElMessage({
                    message: "两次输入的密码不一致", type: 'warning',
                });
                return -1;
            }
            // 发起请求
            await axios({
                method: "POST",
                url: "/sign_up",
                data: {"username": this.register.username, "password": this.register.password},
                withCredentials: true
            })
                .then(response => {
                    if (response.data.code === 200) {
                        this.loginBox.username = this.register.username;
                        this.loginBox.password = this.register.password;
                        ElementPlus.ElMessage({
                            message: "注册用户成功", type: 'success',
                        });
                    } else if (response.data.code === 403) {
                        this.isLogin = false;
                        ElementPlus.ElMessage({
                            message: "onClick_registerBtn", type: 'message',
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            await new Promise(resolve => {
                setTimeout(resolve, 500);
            });
            this.register = {
                "username": null, "email": null, "password": null, "password_again": null
            };
            this.registerBtnLoading = false;
            this.dialogVisible = false;
        },

        // 按下登录按钮
        async onClick_loginBtn() {
            this.LoginBtnLoading = true;
            await axios({
                method: "POST",
                url: "/login",
                data: {"username": this.loginBox.username, "password": this.loginBox.password},
                withCredentials: true
            })
                .then(async resp => {
                    if (resp.data.code === 200) {
                        ElementPlus.ElMessage({
                            message: "用户登录成功", type: 'success',
                        });
                    } else {

                    }
                })
                .catch(err => {
                    console.log(err)
                })
            await new Promise(resolve => {
                setTimeout(resolve, 500);
            });
            this.LoginBtnLoading = false;
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
                        message: resp.data.message, type: 'success',
                    });
                    this.currentUser.username = resp.data.data.username;
                    this.currentUser.role = resp.data.data.role;
                    this.currentUser.last_login_time = resp.data.data.last_login_time;
                    this.linkToHome(this.currentUser.role);
                } else {
                    ElementPlus.ElMessage({
                        message: resp.data.message, type: 'error',
                    });
                    this.password = "";
                }
            }).catch(err => {
                ElementPlus.ElMessage({
                    message: err, type: 'error',
                });
            });
            this.loading = false;
        },

        // 按下按钮，注销
        async onClick_logoutBtn() {
            await axios({
                method: "GET", url: "/logout", withCredentials: true
            }).then(async resp => {
                if (resp.data.code === 200) {
                    await this.checkLoginStatus();
                    ElementPlus.ElMessage({
                        message: "已注销登录", type: 'warning',
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