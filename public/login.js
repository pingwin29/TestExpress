document.getElementById("login-button").addEventListener("click", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email && password) {
    axios
      .post("/api/v1/auth/login", {
        email: email,
        password: password,
      })
      .then(function (response) {
        const { token, type } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("type", type);
        window.location.href = `/`;
      });
  } else {
    alert("Please fill in all fields.");
  }
});
