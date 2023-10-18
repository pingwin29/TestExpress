var type, options;

function getParams(key) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(key);
}

function getEleId(id) {
  return document.getElementById(id);
}

const query = getParams("type");

if (query) {
  localStorage.setItem("type", query);
}

if (!localStorage.getItem("type")) {
  location.href = "/login.html";
}

//main output
type = localStorage.getItem("type");

if (type === "jwt") {
  if (!localStorage.getItem("token")) {
    location.href = "/login.html";
  }
  const token = localStorage.getItem("token");
  const payloadData = JSON.parse(atob(token.split(".")[1]));
  options = { headers: { Authorization: `Bearer ${token}` } };
}
