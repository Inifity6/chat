const loginIdValidator = new fieldValidator("txtLoginId", function (val) {
  if (!val) {
    return "请填写账号";
  }
});

const loginPwdValidator = new fieldValidator("txtLoginPwd", function (val) {
  if (!val) {
    return "请填写密码";
  }
});

const form = $(".user-form");
form.onsubmit = async function (e) {
  e.preventDefault();
  const result = await fieldValidator.validate(
    loginIdValidator,
    loginPwdValidator
  );
  if (!result) {
    return; //验证未通过
  }
  const formData = new FormData(form); //传入一个表单dom,得到一个表单数据对象
  const data = Object.fromEntries(formData.entries());
  const resp = await API.login(data);
  if (resp.code === 0) {
    location.href = "/html/index.html";
  } else {
    loginIdValidator.p.innerText = "账号或密码错误";
    loginPwdValidator.input.value = "";
  }
};
