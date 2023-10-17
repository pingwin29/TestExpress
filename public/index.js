//for logout

function createJobListing(title, company, createDate, status, userType) {
  const jobContainer = document.getElementById("job-list");
  const job = document.createElement("div");
  job.classList.add("job");

  job.innerHTML = `

    <div class="job-card">
    <div class="job-status">${status}</div>
    <div class="position">${title}</div>
    <div class="creator-type">Posted by ${userType}</div>
    <div class="company">${company}</div>
    <div class="buttons">
      <button class="button edit-button">Edit</button>
      <button class="button delete-button">Delete</button>
    </div>
  </div>
               
            `;

  jobContainer.appendChild(job);
}

function jwtUser() {
  try {
    const token = localStorage.getItem("token");
    var payloadData = JSON.parse(atob(token.split(".")[1]));

    //request jobs
    axios.get("/api/v1/jobs/jwt", { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
      const jobs = res.data.jobs.reverse();
      const user = res.data.user;
      document.getElementById("user_name").innerText = user;
      jobs.map((job) => {
        const date = new Date(job.createdAt);
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        };
        const formattedDate = date.toLocaleDateString(undefined, options);
        createJobListing(job.position, job.company, formattedDate, job.status, job.userType);
      });
    });
  } catch (error) {
    location.href = "/login.html";
  }
}

function sessionUser() {
  // request jobs
  axios
    .get("/api/v1/jobs/session")
    .then((res) => {
      const jobs = res.data.jobs.reverse();
      const user = res.data.user;
      console.log(res);

      document.getElementById("user_name").innerText = user;
      jobs.map((job) => {
        const date = new Date(job.createdAt);
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        };
        const formattedDate = date.toLocaleDateString(undefined, options);
        createJobListing(job.position, job.company, formattedDate, job.status, job.userType);
      });
    })
    .catch((err) => {
      location.href = "/login.html";
      s;
    });
}

const searchParams = new URLSearchParams(window.location.search);

const query = searchParams.get("type");

if (query) {
  localStorage.setItem("type", query);
}

if (localStorage.getItem("type")) {
  location.href = "/login.html";
}
const type = localStorage.getItem("type");

console.log({ type });

if (type == "jwt") {
  jwtUser();
} else if (type == "session") {
  sessionUser();
}

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
