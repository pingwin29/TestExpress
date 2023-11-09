const backBtn = getEleId("back_btn");
const userNameEle = getEleId("user_info_name");
const jobContainer = getEleId("jobs_container");
const loadingPage = getEleId("loading-page");
const content = getEleId("content");
const menuBtn = getEleId("menu_btn");
var closeMenuBtn = getEleId("close_job_container");
const filterOBtn = getEleId("filter_option_btn");
const filterOpenBtn = getEleId("filter_open_box_btn");
const filterBoxContainer = getEleId("filter_box_conatainer");
const filterCloseBtn = getEleId("filter_close_box_btn");
const filterForm = getEleId("filter_box_conatainer");
const eidtBtn = getEleId("edit_btn");
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
  return;
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
  console.log({ res });
  userNameEle.innerText = user.name;
  jobContainer.innerHTML = "";

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
        setLoading(true);
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

function filterHandler() {
  alert("submit");
}

// main funtion
if (hasParams("createBy")) {
  var createBy = getParams("createBy");
} else {
  location.href = "/";
}

getEleId("user_img").src = `/img/${createBy}`;
reqJobs(`/api/v1/jobs?createBy=${createBy}`, options);

function getOptionValue(options) {
  let value;
  for (var option of options) {
    if (option.checked == true) {
      value = option.value;
      break;
    }
  }
  return value;
}

filterOBtn.addEventListener("click", () => {
  const orderOptions = document.getElementsByName("order");
  const sortOptions = document.getElementsByName("sort");

  let sort = { orderName: null, sortName: null };

  const orderValue = getOptionValue(orderOptions);
  const sortValue = getOptionValue(sortOptions);

  console.log({ orderValue, sortValue });

  setLoading(true);

  reqJobs(`/api/v1/jobs?createBy=${createBy}&sortBy=${sortValue}&orderBy=${orderValue}`, options);

  filterBoxContainer.classList.remove("active");
});

filterOpenBtn.addEventListener("click", () => {
  filterBoxContainer.classList.add("active");
});

filterCloseBtn.addEventListener("click", () => {
  filterBoxContainer.classList.remove("active");
});

eidtBtn.addEventListener("click", (e) => {
  e.preventDefault();
  location.href = `/editprofile.html?id=${createBy}`;
});
