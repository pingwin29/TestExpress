document.getElementById("register-button").addEventListener("click", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (name && email && password && confirmPassword) {
    if (password === confirmPassword) {
      const data = {
        name: name,
        email: email,
        password: password,
      };

      console.log({ data });

      axios
        .post("/api/v1/auth/register", {
          name: name,
          email: email,
          password: password,
        })
        .then(function (response) {
          console.log(response);

          window.location.href = `/emailc.html?email=${email}`;
        })
        .catch(function (error) {
          // alert(error.response.data.error);
          console.log(error);
        });
    } else {
      alert("Passwords do not match.");
    }
  } else {
    alert("Please fill in all fields.");
  }
});
