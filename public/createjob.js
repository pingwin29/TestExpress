const type = localStorage.getItem("type");

if (type == "jwt") {
  const token = localStorage.getItem("token");

  document.getElementById("submit-btn").addEventListener("click", function (e) {
    e.preventDefault();
    const position = document.getElementById("jobTitle").value;
    const company = document.getElementById("company").value;

    if (position && company) {
      axios
        .post(
          "/api/v1/jobs/jwt",
          { position, company },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          window.location.href = `/main.html`;
        })
        .catch((error) => {
          alert(error.response.data.error);
        });
    } else {
      alert("something wrong");
    }
  });
} else if (type == "session") {
  document.getElementById("submit-btn").addEventListener("click", function (e) {
    e.preventDefault();
    const position = document.getElementById("jobTitle").value;
    const company = document.getElementById("company").value;

    if (position && company) {
      axios
        .post("/api/v1/jobs/session", { position, company })
        .then((response) => {
          window.location.href = `/`;
        })
        .catch((error) => {
          alert(error.response.data.error);
        });
    } else {
      alert("something wrong");
    }
  });
}
