// axios的默认配置
axios.defaults.baseURL = 'http://127.0.0.1:8888';
axios.defaults.withCredentials = true;

// 定义Vue组件
const App = {

    data() {
        return {
            // 编辑用户信息
            userInfo: { username: "正在获取", password: "********", role: "", gender: "男", enable: "1", email: "1234567890@github.com", phone: "1234567890", last_login_time: "1234567890", create_time: "1234567890", avatar: null },
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
                        ElementPlus.ElMessage({
                            message: response.data.message, type: 'success',
                        });
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