const backBtn = getEleId("back_btn");
const userNameEle = getEleId("user_info_name");
const jobContainer = getEleId("jobs_container");
const loadingPage = getEleId("loading-page");
const content = getEleId("content");
const menuBtn = getEleId("menu_btn");
var closeMenuBtn = getEleId("close_job_container");
backBtn.addEventListener("click", () => {
  window.location.href = "/";
});

function showMenuBox() {
  jobMenuContainer.classList.add("active");
}
function hideMenuBox() {
  jobMenuContainer.classList.remove("active");
}

function setLoading(con) {
  console.log("loading " + con);
  loadingPage.style.display = con ? "flex" : "none";
  content.style.display = con ? "none" : "block";
}

function createDateFormat(jobcreateDate) {
  const date = new Date(jobcreateDate);
  const options = {
    year: "numeric",
    month: "long",
    // day: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
  };
  return date.toLocaleDateString(undefined, options);
}

function createJobListing(jobData, CurrentUserData) {
  const { name, userId } = CurrentUserData;
  const { position, company, createdAt, status, userType, _id, createBy } = jobData;
  //   const formattedDate = createDateFormat(createdAt);

  const job = document.createElement("div");
  job.classList.add("job");
  //   job.setAttribute("job_id", _id);

  //   const owner = userId == createBy._id;

  job.innerHTML = `


          <div class="job_function_container" id="job_function_container">
            <ul>
              <li class="close_job_container" id="close_job_container" onclick="hideMenuBox()">
                <i class="fa fa-close"></i>
              </li>
              <li class="job_function"><i class="fa fa-pencil-square-o icon"></i>Edit</li>
              <li class="job_function"><i class="fa fa-trash-o icon"></i>Delete</li>
            </ul>
          </div>
          <div class="job_header">
            <h4>${position}</h4>
            <button class="btn menu_btn" id="menu_btn" onclick="showMenuBox()"><i class="fa fa-ellipsis-h"></i></button>
          </div>
          <div class="job_main">
            <span><i class="fa fa-money icon"></i>:salary</span>
            <span><i class="fa fa-map-marker icon"></i>:location</span>
          </div>
          <div class="job_footer">
            <span class="declined ${status}">${status}</span>
            <button class="btn detail_btn">Detail</button>
          </div>
            `;

  jobContainer.appendChild(job);
  var jobMenuContainer = getEleId("job_function_container");
}

function renderData(res) {
  let { user, jobs, currentPage, totalPage } = res.data;
  userNameEle.innerText = user.name;
  //   jobContainer.innerHTML = "";

  jobs.map((job) => {
    createJobListing(job, user);
  });

  // setPagination(currentPage, totalPage);
}

function reqJobs(url, option = {}) {
  try {
    //request jobs
    axios
      .get(url, option)
      .then((res) => {
        renderData(res);
        setLoading(false);
      })
      .catch((err) => {
        // location.href = "/login.html";
        console.log(err);
      });
  } catch (error) {
    console.log(error);
    // location.href = "/login.html";
  }
}

if (hasParams("createBy")) {
  var createBy = getParams("createBy");
} else {
  location.href = "/";
}
if (type == "jwt") {
  reqJobs(`/api/v1/jobs/jwt?createBy=${createBy}`, options);
} else if (type == "session") {
  reqJobs(`/api/v1/jobs/session?createBy=${createBy}`);
} else {
  location.href = "/login.html";
}
