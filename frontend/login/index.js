// axios的默认配置
axios.defaults.baseURL = 'http://127.0.0.1:8888';
axios.defaults.withCredentials = true;

// 定义Vue组件
const App = {

    data() {
        return {
            title: "基于xbc的管理系统",
            // 登录信息
            loginBox: { "username": null, "password": null },
            LoginBtnLoading: false,
            currentUser: { "username": null, "role": null, "last_login_time": null },
            isLogin: false,
            // 注册信息
            dialogVisible: false,
            register: { "username": null, "email": null, "password": null, "password_again": null },
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
            await axios.get("/check_login_status")
                .then(response => {
                    if (response.data.code === 200) {
                        this.currentUser.username = response.data.data.username;
                        this.currentUser.role = response.data.data.role;
                        this.currentUser.last_login_time = response.data.data.last_login_time;
                        this.isLogin = true;
                    } else if (response.data.code === 403) {
                        this.isLogin = false;
                    }
                })
                .catch(err => {})
        },

        // 注册用户的请求
        async onClick_registerBtn() {
            this.registerBtnLoading = true;
            // 校验数据
            if (this.register.password !== this.register.password_again) {
                this.register.password_again = null;
                ElementPlus.ElMessage({
                    message: "两次输入的密码不一致", type: 'warning',
                });
                return -1;
            }
            // 发起请求
            await axios({
                method: "POST",
                url: "/register",
                data: { "username": this.register.username, "password": this.register.password }
            })
                .then(response => {
                    if (response.data.code === 200) {
                        this.loginBox.username = this.register.username;
                        this.loginBox.password = this.register.password;
                        ElementPlus.ElMessage({
                            message: response.data.message, type: 'success',
                        });
                    } else if (response.data.code === 500) {
                        ElementPlus.ElMessage({
                            message: response.data.message, type: 'warning',
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    this.register = { "username": null, "email": null, "password": null, "password_again": null };
                    this.registerBtnLoading = false;
                    this.dialogVisible = false;
                });
        },

        // 登录请求
        async onClick_loginBtn() {
            this.LoginBtnLoading = true;
            await axios({
                method: "POST",
                url: "/login",
                data: { "username": this.loginBox.username, "password": this.loginBox.password }
            })
                .then(response => {
                    // 登录成功
                    if (response.data.code === 200) {
                        this.currentUser.username = response.data.data.username;
                        this.currentUser.role = response.data.data.role;
                        this.currentUser.last_login_time = response.data.data.last_login_time;
                        this._navigateToHomePage(response.data.data.role);
                        ElementPlus.ElMessage({
                            message: response.data.message, type: 'success',
                        });
                    }
                    // 登录失败
                    else if (response.data.code === 403) {
                        ElementPlus.ElMessage({
                            message: response.data.message, type: 'warning',
                        });
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            this.LoginBtnLoading = false;
        },

        // 注销当前用户
        async onClick_logoutBtn() {
            await axios.get("/logout")
                .then(async response => {
                    if (response.data.code === 200) {
                        await this.http_checkLoginStatus();
                        ElementPlus.ElMessage({
                            message: response.data.message, type: 'success',
                        });
                    }
                })
        },

        // 根据用户角色跳转到不同的落地页
        _navigateToHomePage(role) {
            // 获取当前页面的完整URL，并从完整URL中提取出域名部分
            const currentURL = window.location.href;
            const currentDomain = new URL(currentURL).origin;
            // 根据用户角色的不同，跳转到不同的落地页
            if (role === 'user') window.location.href = currentDomain + "/home/";
            if (role === 'admin') window.location.href = currentDomain + "/admin/";
        }

    },

    async mounted() {
        await this.http_checkLoginStatus();
    }
};

const app = Vue.createApp(App)
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount("#app");

// 按下回车，触发登录按钮的点击事件
const loginBtn = document.getElementById("loginBtn");
document.addEventListener("keydown", function (event) {
    // 判断是否按下回车键（键码：13）
    if (event.keyCode === 13) {
        // 触发登录按钮的点击事件
        loginBtn.click();
    }
});