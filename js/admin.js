
const ADMIN_ID = "admin";
const ADMIN_PW = "1234";

const loginBtn = document.getElementById("loginBtn");
const loginPanel = document.getElementById("loginPanel");
const dashboardPanel = document.getElementById("dashboardPanel");
const loginMsg = document.getElementById("loginMsg");

loginBtn.addEventListener("click", () => {

  const user = document.getElementById("adminUser").value;
  const pass = document.getElementById("adminPass").value;

  if (user === ADMIN_ID && pass === ADMIN_PW) {

    loginPanel.classList.add("hidden");
    dashboardPanel.classList.remove("hidden");

  } else {

    loginMsg.textContent = "로그인 실패";

  }

});
