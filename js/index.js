(async function () {
  //验证是否有登录，若否跳转到登录页，若是获取用户登录信息
  const resp = await API.profile();
  const user = resp.data;
  if (!user) {
    alert("未登录或登录已过期，请重新登录");
    location.href = "/html/login.html";
    return;
  }

  //获取需要的dom
  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    msgContainer: $(".msg-container"),
  };

  setUserInfo(); //设置用户信息

  //加载历史聊天记录
  await loadHistory();
  async function loadHistory() {
    const resp = await API.getHistory();
    for (const item of resp.data) {
      addChat(item);
    }
    scrollBottom();
  }

  //发消息事件
  doms.msgContainer.onsubmit = function (e) {
    e.preventDefault();
    sendChat();
  };

  //退出登录事件
  doms.close.onclick = function () {
    API.loginOut();
    location.href = "/html/login.html";
  };

  /**
   * 设置用户信息的处理函数
   */
  function setUserInfo() {
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  }

  /**
   * 添加消息处理函数
   * @param {object} chatInfo {content:"你几岁啦？"，createdAt:1651213093992,from:'haha',to:null}
   */
  function addChat(chatInfo) {
    const div = $$$("div");
    div.classList.add("chat-item");
    if (chatInfo.from) {
      div.classList.add("me");
    }
    const img = $$$("img");
    img.className = "chat-avatar";
    img.src = chatInfo.from ? "/asset/avatar.png" : "/asset/robot-avatar.jpg";
    const content = $$$("div");
    content.className = "chat-content";
    content.innerText = chatInfo.content;
    const date = $$$("div");
    date.className = "chat-date";
    date.innerText = formDate(Date.now());
    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);
    doms.chatContainer.appendChild(div);
  }

  /**
   * 发送消息处理函数
   */
  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }
    doms.txtMsg.value = "";
    addChat({
      from: user.loginId,
      to: null,
      content,
    });
    scrollBottom();
    const resp = await API.sendChat(content);
    addChat({
      from: null,
      to: user.loginId,
      ...resp.data,
    });
    scrollBottom();
  }

  /**
   * 聊天区域滚动处理函数
   */
  function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }

  /**
   *生成时间处理函数
   * @param {Number} timestamp 时间戳
   * @returns string 时间
   */
  function formDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
})();
