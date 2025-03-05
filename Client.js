"use strict";

(() => {})();

let item = "HELLO WORLD";

function getSingleVid(element) {
  const VideoListEle = document.getElementById("listOfRequests");

  const VideoRequestTemplate = `
    <div class="card mb-3">
      <div class="card-body d-flex justify-content-between flex-row">
        <div class="d-flex flex-column">
          <h3>${element.topic_title}</h3>
          <p class="text-muted mb-2">${element.topic_details}</p>
          <p class="mb-0 text-muted">
            <strong>Expected results:</strong> ${element.expected_result}
          </p>
        </div>
        <div class="d-flex flex-column text-center">
          <a id="up${element._id}" class="btn btn-link">🔺</a>
          <h3 id="vote${element._id}">${element.votes?.ups.length - element.votes?.downs.length}</h3>
          <a id="down${element._id}" class="btn btn-link">🔻</a>
        </div>
      </div>
      <div class="card-footer d-flex flex-row justify-content-between">
        <div>
          <span class="text-info">${element.status}</span>
          &bullet; added by <strong>${element.author_name}</strong> on
          <strong>${new Date(element.submit_date).toLocaleDateString()}</strong>
        </div>
        <div class="d-flex justify-content-center flex-column ml-auto mr-2">
          <div class="badge badge-success">${element.target_level}</div>
        </div>
      </div>
    </div>`;

  const VideoListContainer = document.createElement("div");
  VideoListContainer.innerHTML = VideoRequestTemplate;
  VideoListEle.appendChild(VideoListContainer);

  return VideoListContainer;
}

document.addEventListener("DOMContentLoaded", () => {
  // Ensure the DOM is loaded but not images or CSS
  const myForm = document.getElementById("MyVideoForm");
  const VideoListEle = document.getElementById("listOfRequests");
  const voteOptions = document.getElementById("voteOptions");
  const SearchText = document.getElementById("searchText");
  const submitButton = document.getElementById("submitButton");
  const LoginForm = document.getElementById("LoginForm");
  const Loginbody = document.getElementById("Loginbody");
  const Pagebody = document.getElementById("Pagebody");
  
  let userid;

  if (window.location.search) {
    userid = new URLSearchParams(window.location.search).get("id");
    if (userid) {
      Loginbody.classList.add("d-none");
      Pagebody.classList.remove("d-none");
    }
  }

  LoginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let myData = new FormData(LoginForm);

    fetch("http://localhost:7777/users/login", { method: "POST", body: myData })
      .then((data) => {
        userid = new URLSearchParams(data.url).get("id");
        console.log("User ID is", userid);
        window.history.pushState({}, "", data.url);
        Loginbody.classList.add("d-none");
        Pagebody.classList.remove("d-none");
      });
  });

  let orderBy = "";
  let searchQuery = "";

  SearchText.addEventListener(
    "keyup",
    debounce((e) => {
      searchQuery = e.target.value;
      getAll(orderBy, searchQuery);
    }, 300)
  );

  voteOptions.addEventListener("change", (e) => {
    orderBy = e.target.value === "top" ? "top" : "new";
    getAll(orderBy, searchQuery);
  });

  getAll();

  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    const myFormData = new FormData(myForm);
    let firstInvalidElement = null;
    let invalidCounter = 0;

    const elements = myForm.querySelectorAll("[required]");

    elements.forEach((el, index) => {
      if (el.value === "") {
        invalidCounter++;
        el.classList.add("is-invalid");
        if (!firstInvalidElement) firstInvalidElement = el;
      }

      el.addEventListener("input", () => {
        el.classList.remove("is-invalid");
      });

      if (index === elements.length - 1 && firstInvalidElement) {
        firstInvalidElement.focus();
      }
    });

    if (invalidCounter === 0) {
      fetch("http://localhost:7777/video-request", {
        method: "POST",
        body: myFormData,
      })
        .then((e) => e.json())
        .then((res) => {
          VideoListEle.prepend(getSingleVid(res));

          const up = document.getElementById(`up${res._id}`);
          const voteValue = document.getElementById(`vote${res._id}`);
          const down = document.getElementById(`down${res._id}`);

          up.addEventListener("click", () => updateVote(res._id, "ups", voteValue));
          down.addEventListener("click", () => updateVote(res._id, "downs", voteValue));
        });
    }
  });

  function getAll(orderBy = "new", search = "") {
    const VideoListEle = document.getElementById("listOfRequests");

    fetch(`http://localhost:7777/video-request?orderBy=${orderBy}&search=${search}`)
      .then((blob) => blob.json())
      .then((data) => {
        VideoListEle.innerHTML = "";
        data.forEach((element) => {
          getSingleVid(element);
          const up = document.getElementById(`up${element._id}`);
          const voteValue = document.getElementById(`vote${element._id}`);
          const down = document.getElementById(`down${element._id}`);

          up.addEventListener("click", () => updateVote(element._id, "ups", voteValue));
          down.addEventListener("click", () => updateVote(element._id, "downs", voteValue));
        });
      });
  }

  function updateVote(id, voteType, voteValue) {
    fetch("http://localhost:7777/video-request/vote", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, vote_type: voteType, userid: userid }),
      method: "PUT",
    })
      .then((data) => data.json())
      .then((data) => {
        if(data.message){
          alert(data.message)
          return
        }
        console.log('length is',data.votes.ups.length +'and down is'+ data.votes.downs.length)
        voteValue.innerText = data.votes.ups.length - data.votes.downs.length;
      });
  }

  function debounce(fn, time) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), time);
    };
  }
});
