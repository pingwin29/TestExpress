const searchTextEle = getEleId("search");
const jobContainer = getEleId("job-list");
// const paginationContainer = getEleId("pagination");
const logoutBtn = getEleId("logout_btn");
const loadingPage = getEleId("loading-page");
const content = getEleId("content");
const closeBtn = getEleId("close_btn");
const openBtn = getEleId("menu_m_btn");
const mobileMenu = getEleId("menu_container_mobile");
const profileBtn = getEleId("profile_btn");

const filterOBtn = getEleId("filter_option_btn");
const filterOpenBtn = getEleId("filter_open_box_btn");
const filterBoxContainer = getEleId("filter_box_conatainer");
const filterCloseBtn = getEleId("filter_close_box_btn");

let filter_data = "";
let search_data = "";

//delete job fun
function deletejobProcess(url, Element, option = {}) {
  axios
    .delete(url, option)
    .then((res) => {
      alert("deleted sucessfiull");
      Element.remove();
    })
    .catch((err) => {
      console.log(err);
    });
}

//job delete btn  handler
// function deleteHandler(e) {
//   const parentElement = e.target.closest(".job");
//   const job_id = parentElement.getAttribute("job_id");

//   if (type == "jwt") {
//     deletejobProcess(`/api/v1/jobs/jwt/${job_id}`, parentElement, options);
//   }

//   if (type == "session") {
//     deletejobProcess(`/api/v1/jobs/session/${job_id}`, parentElement);
//   }
// }

//job edit btn  handler
// function editHandler(e) {
//   const parentElement = e.target.closest(".job");
//   const job_id = parentElement.getAttribute("job_id");
//   location.href = `/edit.html?id=${job_id}`;
// }

// for show create date formate from database time
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

//for display create list card html
function createJobListing(jobData, CurrentUserData) {
  const { name, userId } = CurrentUserData;
  const { position, company, createdAt, status, userType, _id, createBy } =
    jobData;
  const formattedDate = createDateFormat(createdAt);

  profileBtn.setAttribute("id", userId);

  getEleId("profile_img").src = `/img/${userId}`;

  const job = document.createElement("div");
  job.classList.add("job");
  job.setAttribute("job_id", _id);

  // const owner = userId == createBy._id;

  job.innerHTML = `

  <div class="job_header">
              <h4>${position}</h4>
            
            </div>
            <div class="job_main">
              <span><i class="fa fa-money icon"></i>:salary</span>
              <span><i class="	fa fa-map-marker icon"></i>:location</span>
            </div>
            <div class="job_footer">
              <span class="declined ${status}">${status}</span>
              <a class="btn detail_btn" href="/jobdetail.html?id=${_id}">Detail</a>
            </div>
            `;

  jobContainer.appendChild(job);
}

function setLoading(con) {
  console.log("loading " + con);
  loadingPage.style.display = con ? "flex" : "none";
  content.style.display = con ? "none" : "block";
}

function renderData(res) {
  console.log({ res });
  let { user, jobs, currentPage, totalPage } = res.data;
  document.getElementById("user_name").innerText = user.name;

  jobContainer.innerHTML = "";

  console.log({ user });
  jobs.map((job) => {
    createJobListing(job, user);
  });

  // setPagination(currentPage, totalPage);
}

// to req job list fun
function reqJobs(url, option = {}) {
  try {
    //request jobs
    console.log({ url, option });
    axios
      .get(url, option)
      .then((res) => {
        console.log({ res });
        renderData(res);
        setPgn(res);
        setLoading(false);
      })
      .catch((err) => {
        location.href = "/login.html";
        console.log(err);
      });
  } catch (error) {
    console.log(error);
    location.href = "/login.html";
  }
}

function reqWithPagination(index) {
  setLoading(true);
  if (type == "jwt") {
    reqJobs(`/api/v1/jobs/jwt?page=${index}&perPage=15`, options);
  } else {
    reqJobs(`/api/v1/jobs/session?page=${index}&perPage=15`);
  }
}

function setPgn(res) {
  const { currentPage, totalPage } = res.data;
  let content = "";
  for (let page = 1; page <= totalPage; page++) {
    content += `<div class="pgn_button ${
      currentPage == page ? "active" : ""
    }">${page}</div>`;
  }

  $(".pgn").html(content);

  //pagination libaray
  $(function () {
    var button = $(".pgn_button");
    function switchToNext() {
      var _this = $(this);
      let text = _this.text();
      reqJobs(
        `/api/v1/jobs?perPage=15&page=${text}&${filter_data}&${search_data}`,
        options
      );
      console.log(
        `/api/v1/jobs?perPage=15&page=${text}&${filter_data}&${search_data}`
      );
      setLoading(true);
      if (_this.hasClass("active")) {
        return false;
      } else {
        $(".pgn_button.active").removeClass("active");
        _this.addClass("active");
      }
    }
    button.on("click", switchToNext);
  });
}

// main start point
reqJobs(`/api/v1/jobs?perPage=15`, options);

//logout btn
logoutBtn.addEventListener("click", function (e) {
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

profileBtn.addEventListener("click", () => {
  window.location.href = `/profile.html?createBy=${profileBtn.getAttribute(
    "id"
  )}`;
});

searchTextEle.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    setLoading(true);

    const searchKeyWord = searchTextEle.value;
    search_data = `search=${searchKeyWord}`;
    reqJobs(`/api/v1/jobs?search=${searchKeyWord}&${filter_data}`, options);
  }
});

document.getElementById("dropdown").addEventListener("click", () => {
  document.getElementById("dropdown").classList.toggle("active");
});

closeBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
  content.classList.toggle("active");
});

openBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
  content.classList.toggle("active");
});

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

  setLoading(true);
  filter_data = `sortBy=${sortValue}&orderBy=${orderValue}`;

  reqJobs(
    `/api/v1/jobs?sortBy=${sortValue}&orderBy=${orderValue}&${search_data}`,
    options
  );
  filterBoxContainer.classList.remove("active");
});

filterOpenBtn.addEventListener("click", () => {
  filterBoxContainer.classList.toggle("active");
});

filterCloseBtn.addEventListener("click", () => {
  filterBoxContainer.classList.remove("active");
});
