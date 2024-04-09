function setData(data) {
  const array = [
    "company",
    "gender",
    "job_description",
    "location",
    "position",
    "requirement",
    "salary",
  ];

  $("#loading-page").hide();
  const hr = new Date(new Date() - new Date(data.createdAt));

  const min = hr.getUTCMinutes();
  let hour = Math.floor(min / 60);

  console.log({ hour, min });

  $("#hr").text(hour);
  $("#min").text(min);

  array.map((info) => {
    $(`#${info}`).text(data[info]);
  });
}
axios.get(`/api/v1/jobs/${getParams("id")}`, options).then((res) => {
  setData(res.data.job);
});
