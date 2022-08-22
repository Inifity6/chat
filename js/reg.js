const loginIdValidator = new fieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "请填写账号";
  }
  const resp = await API.exists(val);
  if (resp.data) {
    return "该账号名已存在，请重新输入";
  }
});
const nicknameValidator = new fieldValidator("txtNickname", function (val) {
  if (!val) {
    return "请填写昵称";
  }
});
const loginPwdValidator = new fieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "请填写密码";
  }
});
const loginPwdConfirmValidator = new fieldValidator(
  "txtLoginPwdConfirm",
  function (val) {
    if (!val) {
      return "请填写确认密码";
    }
    if (val !== loginPwdValidator.input.value) {
      return "两次输入的密码不一致";
    }
  }
);
const form = $(".user-form");
form.onsubmit = async function (e) {
  e.preventDefault();
  const result = await fieldValidator.validate(
    loginIdValidator,
    nicknameValidator,
    loginPwdValidator,
    loginPwdConfirmValidator
  );
  if (!result) {
    return; //验证未通过
  }
  const formData = new FormData(form); //传入一个表单dom,得到一个表单数据对象
  const data = Object.fromEntries(formData.entries());
  const resp = await API.reg(data);
  if (resp.code === 0) {
    alert("注册成功，点击确定，跳转到登录页面");
    location.href = `${basURL}login.html`;
  }
};
