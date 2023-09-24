document.addEventListener("DOMContentLoaded", function () {
  const socket = io();
  const signUpForm = document.getElementById("signUpForm");

  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const dataForm = new FormData(e.target);
    console.log(dataForm);
    const newUser = Object.fromEntries(dataForm);
    socket.emit("newUser", newUser);
  });

  socket.on("alreadyUser", (user) => {
    window.location.href = "/login";
  });
});
