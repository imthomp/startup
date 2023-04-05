function displayPicture() {
  const url = "https://picsum.photos/id/24/info";
  fetch(url)
    .then((x) => x.json())
    .then((response) => {
      const src = response.download_url;
      makeImg(src);
    });
  
  function makeImg(src) {
    const divEl = document.querySelector("#fun-image");
    const imgEl = divEl.appendChild(document.createElement("img"));
    imgEl.src = src;
    //imgEl.height = "300";
  }
}

displayPicture();

function goToLogin() {
  window.location.href = "login.html";
}