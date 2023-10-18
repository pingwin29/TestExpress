const updateBtn = getEleId("update-btn");
const positionEle = getEleId("jobPosition");
const companyEle = getEleId("company");
const job_id = getParams("id");
//main
function main() {
  updateBtn.disabled = true;

  if (type == "jwt") {
    getJob(`/api/v1/jobs/jwt/${job_id}`, options);
  } else if (type == "session") {
    getJob(`/api/v1/jobs/session/${job_id}`);
  }
}

function updateHandler() {
  const position = positionEle.value;
  const company = companyEle.value;

  const body = { position, company };

  if (company && position) {
    if (type == "jwt") {
      updateJob(`/api/v1/jobs/jwt/${job_id}`, body, options);
    } else if (type == "session") {
      updateJob(`/api/v1/jobs/session/${job_id}`, body);
    }
  } else {
    alert("please fill fields");
  }
}

function indexField(jobData) {
  const { company, position } = jobData;

  positionEle.value = position;
  companyEle.value = company;

  updateBtn.disabled = false;
}

function updateJob(url, body, option = {}) {
  axios
    .patch(url, body, option)
    .then((res) => {
      location.href = "/";
    })
    .catch((err) => {
      console.log({ err });
    });
}

function getJob(url, option = {}) {
  axios
    .get(url, option)
    .then((res) => {
      indexField(res.data.job);
    })
    .catch((err) => console.log({ err }));
}

main();
