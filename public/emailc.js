document.getElementById("verify-btn").addEventListener("click", function (e) {
  e.preventDefault();
  const code = document.getElementById("verification-code").value;

  if (code) {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("email")) {
      var email = searchParams.get("email");
    }

    axios
      .post(`/api/v1/auth/register/${email}`, {
        code: code,
      })
      .then(function (response) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        window.location.href = `/`;
      })
      .catch(function (error) {
        alert(error.response.data.error);
        console.log(error);
      });
  } else {
    alert("Please fill in all fields.");
  }
});
