document.getElementById("reset-button").addEventListener("click", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;

  if (email) {
    axios
      .get(`/api/v1/auth/forget?email=${email}`)
      .then((response) => {
        window.location.href = `/changeps.html?email=${email}`;
      })
      .catch((error) => {
        alert(error.response.data.error);
      });
  } else {
    alert("something wrong");
  }
});
