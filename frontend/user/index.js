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

// utils
// 将毫秒时间戳转换为本地时区的时间日期字符串，格式为：YYYY/MM/DD hh:mm:ss
function show_timestampToDateString(timestamp) {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    return date.toLocaleString(options);
}

// 隐藏密码字符串，转换为 "******" 样式
function show_hidePasswordString(passwordString) {
    if (!passwordString) return "";
    return '*'.repeat(passwordString.length);
}

// 将账户状态的 enable 代号转换为字符串提示
function show_accountStatus(enable) {
    if (enable === 0) return "未启用";
    if (enable === 1) return "正常";
    return "";
}

// 定义Vue组件
const App = {

    data() {
        return {
            // 编辑用户信息
            userInfo: { username: null, password: null, role: null, gender: null, enable: null, email: null, phone: null, last_login_time: null, create_time: null, avatar: null },
            isEdit: false,
            isUpdateBtnLoading: false,
        };
    },

    computed: {

    },

    methods: {

        // 获取用户信息
        async http_getUserInfo() {
            await axios.get("/get_user_info")
                .then(response => {
                    if (!response.data.code === 200)
                        return -1;
                    this.userInfo = response.data.data;
                })
                .catch(err => { })
        },

        // 更改用户信息
        async http_updateUserInfo() {
            this.isUpdateBtnLoading = true;
            const payload = {
                "password": this.userInfo.password,
                "nickname": this.userInfo.nickname,
                "email": this.userInfo.email,
                "phone": this.userInfo.phone,
                "gender": this.userInfo.gender
            }
            await axios({
                method: "POST",
                url: "/update_user_info",
                data: payload
            })
                .then(response => {
                    if (response.data.code === 200)
                        ElementPlus.ElMessage({ message: response.data.message, type: 'success' });
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(async () => {
                    await this.http_getUserInfo()
                    this.isEdit = false;
                    this.isUpdateBtnLoading = false;
                })
        },

        // 更换头像
        async onClick_changeAvatar() {
            // 创建一个 input 元素
            const input = document.createElement('input');
            // 设置 input 元素的 type 属性为 file
            input.type = 'file';
            // 设置 input 元素的 accept 属性为 image 类型
            input.accept = 'image/*';
            // 移除 multiple 属性，限制只能选择一个文件
            input.removeAttribute('multiple');
            // 添加 change 事件监听器
            input.addEventListener('change', () => {
                // 获取选择的文件对象
                const file = input.files[0];
                console.log(file);
                // 检查文件大小是否大于 200KB
                const maxSize = 200 * 1024; // 200KB
                if (file.size > maxSize) {
                    ElementPlus.ElMessage({ message: "文件太大，请选择小于200KB的图像", type: 'warning' });
                    // 清空 input 的选中状态
                    input.value = '';
                    return; // 停止执行后续操作
                }
                // 接下来要将文件对象转换成 Base64 编码
                // 创建一个 FileReader 对象
                const reader = new FileReader();
                // 设置 FileReader 对象读取完成时的回调函数
                reader.onload = event => {
                    // 将文件内容转换为 Base64 编码
                    const base64String = event.target.result;
                    // 在这里可以将 Base64 编码的数据上传到服务器，或者进行其他操作
                    // 将 Base64 上传到服务器
                    axios({
                        method: "POST",
                        url: "/update_avatar",
                        data: { "avatar": base64String }
                    }).then(async response => {
                        if (response.data.code === 200) {
                            await this.http_getUserInfo();
                            ElementPlus.ElMessage({ message: response.data.message, type: 'success' });
                        }
                    })
                };
                // 读取文件内容，读取完成后发起http请求，上传图像
                reader.readAsDataURL(file);
            });
            // 触发 input 元素的 click 事件，弹出文件选择框
            input.click();
        },

        // 将毫秒时间戳转换为本地时区的时间日期字符串
        _timestampToDateString(timestamp) {
            return show_timestampToDateString(timestamp)
        },

        // 隐藏密码字符串
        _hidePasswordString(passwordString) {
            return show_hidePasswordString(passwordString)
        },

        // 显示账户状态
        _show_accountStatus(enable) {
            return show_accountStatus(enable)
        }

    },

    async mounted() {
        await this.http_getUserInfo();
    }
};

const app = Vue.createApp(App)
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount("#app");