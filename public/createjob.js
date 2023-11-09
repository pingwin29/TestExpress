getEleId("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(getEleId("form"));
  axios
    .post(`/api/v1/jobs`, formData, options)
    .then((res) => {
      window.location.href = `/`;
    })
    .catch((err) => {
      alert(error.response.data.error);
    });
});
