function checkType() {
  const searchParams = new URLSearchParams(window.location.search);

  const query = searchParams.get("type");

  if (query) {
    localStorage.setItem("type", query);
  }

  if (!localStorage.getItem("type")) {
    location.href = "/login.html";
  }
  const type = localStorage.getItem("type");

  return type;
}
