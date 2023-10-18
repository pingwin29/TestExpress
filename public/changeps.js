document.getElementById("change-btn").addEventListener("click", function (e) {
  e.preventDefault();

  const veriCode = document.getElementById("verificationCode").value;
  const password = document.getElementById("newPassword").value;
  const repassword = document.getElementById("rePassword").value;

  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has("email")) {
    var email = searchParams.get("email");
  }

  if (veriCode && password && repassword) {
    if (password == repassword) {
      axios
        .patch(`/api/v1/auth/forget/changepass?email=${email}`, {
          veriCode: veriCode,
          password: password,
        })
        .then(function (response) {
          console.log(response);
          window.location.href = `/login.html`;
        })
        .catch(function (error) {
          alert(error.response.data.error);
          console.log(error);
        });
    } else {
      alert("please provide the same password and repassword");
    }
  } else {
    alert("please provide all fields");
  }
});
