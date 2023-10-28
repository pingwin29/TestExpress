function getParams(key) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(key);
}

function hasParams(key) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.has(key);
}

function getEleId(id) {
  return document.getElementById(id);
}

getEleId("verify-btn").addEventListener("click", function (e) {
  e.preventDefault();
  const code = getEleId("verification-code").value;

  // if (code) {
  if (hasParams("email")) {
    const email = getParams("email");
    axios
      .post(`/api/v1/auth/register/${email}`, { code: code })
      .then((response) => {
        console.log("Response:", response.data);
        const token = response.data.token;

        localStorage.setItem("token", token);
        localStorage.setItem("type", "jwt");
        window.location.href = `/`;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  // } else {
  //   alert("Please fill in all fields.");
  // }
});

//     // const token = response.data.token;

//     // localStorage.setItem("token", token);
//     // localStorage.setItem("type", "jwt");
//     // window.location.href = `/`;
