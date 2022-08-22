var API = (function () {
  const BASE_URL = "https://study.duyiedu.com";
  const TOKEN_KEY = "token";
  /**
   *post请求处理函数
   * @param {String} path 请求地址的部分
   * @param {Object} bodyObj 请求体
   * @returns Promise
   */
  function post(path, bodyObj) {
    const headers = { "content-Type": "application/json" };
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyObj),
    });
  }
  /**
   *get请求处理函数
   * @param {String} path 请求地址的部分
   * @returns Promise
   */
  function get(path) {
    const headers = {};
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, { headers });
  }
  /**
   * 注册
   * @param {Object} userInfo 注册信息{loginId:xxx,nickname:xxx,loginPwd:xxx}
   * @returns Promise
   */
  async function reg(userInfo) {
    const resp = await post("/api/user/reg", userInfo);
    return resp.json();
  }
  /**
   * 登录
   * @param {Object} loginInfo 登录信息{loginId:xxx,loginPwd:xxx}
   * @returns Promise
   */
  async function login(loginInfo) {
    const resp = await post("/api/user/login", loginInfo);
    const result = await resp.json();
    if (result.code === 0) {
      //登录成功，把响应头的authorization保存到localStorage
      const token = resp.headers.get("authorization");
      localStorage.setItem(TOKEN_KEY, token);
    }
    return result;
  }
  /**
   * 验证账号
   * @param {String} loginId
   * @returns Promise
   */
  async function exists(loginId) {
    const resp = await get("/api/user/exists?loginId=" + loginId);
    return resp.json();
  }
  /**
   * 当前用户登录的信息
   * @returns Promise
   */
  async function profile() {
    const resp = await get("/api/user/profile");
    return resp.json();
  }
  /**
   * 发送聊天消息
   * @param {String} content
   *@returns Promise
   */
  async function sendChat(content) {
    const resp = await post("/api/chat", { content });
    return resp.json();
  }
  /**
   * 获取聊天记录
   * @returns Promise
   */
  async function getHistory() {
    const resp = await get("/api/chat/history");
    return resp.json();
  }
  /**
   * 退出登录
   */
  function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
  }
  return {
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut,
  };
})();
