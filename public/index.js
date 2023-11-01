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
  const { position, company, createdAt, status, userType, _id, createBy } = jobData;
  const formattedDate = createDateFormat(createdAt);

  profileBtn.setAttribute("id", userId);

  const job = document.createElement("div");
  job.classList.add("job");
  job.setAttribute("job_id", _id);

  const owner = userId == createBy._id;

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
              <button class="btn detail_btn">Detail</button>
            </div>
            `;

  jobContainer.appendChild(job);
}

// <div class="job-card">
//   <div class="job-status ${status}">${status}</div>
//   <div class="position">${position}</div>
//   <div class="creator-type">Posted by ${createBy.name}</div>
//   <div class="company">${company}</div>
//   <div class="buttons">
//     $
//     {owner
//       ? "<button class='button edit-button' id='edit-btn' onclick='editHandler(event)'>Edit</button><button class='button delete-button' id = 'delete-btn' onclick = 'deleteHandler(event)' > Delete</ > "
//       : "<button class='button edit-button' id='edit-btn' onclick=''>Apply</button>"}
//   </div>
// </div>;

function setLoading(con) {
  console.log("loading " + con);
  loadingPage.style.display = con ? "flex" : "none";
  content.style.display = con ? "none" : "block";
}

// function setPagination(currentPage, totalPage) {
//   const generatePage = () => {
//     let data = "";
//     for (let index = 1; index <= totalPage; index++) {
//       if (index == currentPage) {
//         data += `<a class='active' onclick="reqWithPagination(${index})">${index}</a>`;
//         continue;
//       }
//       data += `<a onclick="reqWithPagination(${index})">${index}</a>`;
//     }
//     return data;
//   };

//   paginationContainer.innerHTML = `
// ${generatePage()}`;
// }

//if req sucessfull

function renderData(res) {
  let { user, jobs, currentPage, totalPage } = res.data;
  document.getElementById("user_name").innerText = user.name;
  jobContainer.innerHTML = "";

  jobs.map((job) => {
    createJobListing(job, user);
  });

  // setPagination(currentPage, totalPage);
}

// to req job list fun
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

function reqWithPagination(index) {
  setLoading(true);
  if (type == "jwt") {
    reqJobs(`/api/v1/jobs/jwt?page=${index}&perPage=5`, options);
  } else {
    reqJobs(`/api/v1/jobs/session?page=${index}&perPage=5`);
  }
}

// main start point

if (type == "jwt") {
  reqJobs("/api/v1/jobs/jwt", options);
} else if (type == "session") {
  reqJobs("/api/v1/jobs/session");
} else {
  // location.href = "/login.html";
}

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
  window.location.href = `/profile.html?id=${profileBtn.getAttribute("id")}`;
});

searchTextEle.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    setLoading(true);

    const searchKeyWord = searchTextEle.value;
    if (type == "jwt") {
      reqJobs(`/api/v1/jobs/jwt?search=${searchKeyWord}`, options);
    } else {
      reqJobs(`/api/v1/jobs/session?search=${searchKeyWord}`);
    }
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
