const userAvatar = document.querySelector(".user__avatar");
const userNameElem = document.querySelector(".user__name");
const userLocation = document.querySelector(".user__location");
const userFolowers = document.querySelector(".user__folowers");
const userFolowing = document.querySelector(".user__folowing");
const userRepos = document.querySelector(".user__repos");
const userReposUrl = document.querySelector(".repo-list");
const spinner = document.querySelector(".spin");

const defaultAvatar = "https://avatars3.githubusercontent.com/u10004";

userAvatar.src = defaultAvatar;

function showSpinner() {
  spinner.classList.add("spinner");
}
function hideSpinner() {
  spinner.classList.remove("spinner");
}

// Fetch and render user name
let repos = null;
async function fetchUser(user) {
  return await fetch(`https://api.github.com/users/${user}`).then((response) =>
    response.json()
  );
}

async function fetchRepo(user, element) {
  if (!user) return;
  const response = await fetch(`https://api.github.com/users/${user}/repos`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("No data for response");
      }
      return response.json();
    })
    .then((data) => renderRepos(element, data))
    .catch((error) => {
      console.warn(error.message);
    });
  return response;
}

function renderUserData(userElem) {
  if (!userElem) {
    console.error("user data is missing");
    return;
  }
  const {
    avatar_url,
    name,
    location,
    followers,
    following,
    public_repos,
    repos_url,
  } = userElem;

  userAvatar.src = avatar_url;
  userNameElem.textContent = name || "Unknown";
  userLocation.textContent = location ? `from ${location}` : "";
  userFolowers.textContent = followers ? `followers: ${followers},` : "";
  userFolowing.textContent = following ? `following: ${following},` : "";
  userRepos.textContent = public_repos ? `REPOS: ${public_repos}.` : "";
  userReposUrl.textContent = repos_url ? `REPO list: ` : "";
}

function renderRepos(element, data) {
  if (!element) return;
  data.forEach((elem) => {
    element.innerHTML += `
      <span class="repo-list__item">${elem.name}</span>
    `;
  });
}

const showUserBtn = document.querySelector(".name-form__btn");
const userNameInput = document.querySelector(".name-form__input");

function onSearch() {
  showSpinner();
  const userName = userNameInput.value;
  fetchUser(userName)
    .then((userData) => {
      renderUserData(userData);
      hideSpinner();
    })
    .catch((err) => {
      console.warn(err);
      hideSpinner();
    });
  fetchRepo(userName, userReposUrl);
}
showUserBtn.addEventListener("click", onSearch);
userNameInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    onSearch();
  }
});
