const type = checkType();
var options;

//job delete btn  handler
function deleteHandler(e) {
  const parentElement = e.target.closest(".job");
  const job_id = parentElement.getAttribute("job_id");

  if (type == "jwt") {
    axios
      .delete(`/api/v1/jobs/jwt/${job_id}`, options)
      .then((res) => {
        alert("sucessfully deleted");
        parentElement.remove();
      })
      .catch((err) => {
        console.log({ err });
      });
  }

  if (type == "session") {
    axios
      .delete(`/api/v1/jobs/session/${job_id}`)
      .then((res) => {
        alert("sucessfully deleted");
        parentElement.remove();
      })
      .catch((err) => {
        console.log({ err });
      });
  }
}

//job edit btn  handler
function editHandler(e) {
  alert("edit");
}

// for show create date formate from database time
function createDateFormat(jobcreateDate) {
  const date = new Date(jobcreateDate);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString(undefined, options);
}

//for display create list card html
function createJobListing(jobData, userId) {
  const { position, company, createdAt, status, userType, _id, createBy } = jobData;
  const formattedDate = createDateFormat(createdAt);

  const jobContainer = document.getElementById("job-list");
  const job = document.createElement("div");
  job.classList.add("job");
  job.setAttribute("job_id", _id);

  const owner = userId == createBy;

  job.innerHTML = `

    <div class="job-card">
    <div class="job-status">${status}</div>
    <div class="position">${position}</div>
    <div class="creator-type">Posted by ${userType}</div>
    <div class="company">${company}</div>
    <div class="buttons">
      ${
        owner
          ? "<button class='button edit-button' id='edit-btn' onclick='editHandler(event)'>Edit</button><button class='button delete-button' id = 'delete-btn' onclick = 'deleteHandler(event)' > Delete</ > "
          : "<button class='button edit-button' id='edit-btn' onclick=''>Apply</button>"
      }
    </div>
  </div>
               
            `;

  jobContainer.appendChild(job);
}

//if req sucessfull
function reqSucess(res) {
  let { user, jobs } = res.data;
  document.getElementById("user_name").innerText = user.name;
  jobs.reverse().map((job) => {
    createJobListing(job, user.userId);
  });
}

// to create for jwt user
function createHeader() {
  const token = localStorage.getItem("token");
  const payloadData = JSON.parse(atob(token.split(".")[1]));
  options = { headers: { Authorization: `Bearer ${token}` } };
}

// to req job list fun
function reqJobs(url, option = {}) {
  try {
    //request jobs
    axios.get(url, option).then((res) => {
      reqSucess(res);
    });
  } catch (error) {
    location.href = "/login.html";
  }
}

// main start point
if (type == "jwt") {
  createHeader();
  reqJobs("/api/v1/jobs/jwt", options);
} else if (type == "session") {
  reqJobs("/api/v1/jobs/session");
}

//logout btn
document.getElementById("logout_btn").addEventListener("click", function (e) {
  e.preventDefault();
  if (type == "jwt") {
    localStorage.removeItem("token");
  } else {
    axios.get("/api/v1/auth/logout").then((res) => {
      console.log({ res });
    });
  }
  window.location.href = "/login.html";
});
