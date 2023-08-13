// 打开或关闭id为 xx 的对话框
function changeDialogVisible(id, visible) {
    const registerDialogElement = document.getElementById(id);
    if (visible == true) {
        registerDialogElement.style.display = 'flex';
    }
    else {
        registerDialogElement.style.display = 'none';
    }
}

// 打开注册对话框
const registerBtn = document.getElementById('register-btn');
registerBtn.addEventListener('click', function () {
    changeDialogVisible('register-dialog', true);
});


// 关闭注册对话框
const dialogCancelBtn = document.getElementById('register-dialog').querySelector('#register-dialog-cancel-btn');
dialogCancelBtn.addEventListener('click', function () {
    changeDialogVisible('register-dialog', false);
});

// 确定注册按钮
const dialogOkBtn = document.getElementById('register-dialog').querySelector('#register-dialog-ok-btn');
const newUsernameInput = document.getElementById('new-username');
const newPasswordInput = document.getElementById('new-password');
const newPassword2Input = document.getElementById('new-password2');
dialogOkBtn.addEventListener('click', function () {
    if (newUsernameInput.value === '') {
        alert("请设置用户名");
        return;
    }
    if (newPasswordInput.value === '') {
        alert("请设置密码");
        return;
    }
    if (newPassword2Input.value === '') {
        alert("请再次确认你的密码");
        return;
    }
    if (newPasswordInput.value !== newPassword2Input.value) {
        alert("两次输入的密码不一致");
        return;
    }
    // 发送请求
    changeDialogVisible('register-dialog', false);
});