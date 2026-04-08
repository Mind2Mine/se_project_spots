const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseButton = editProfileModal.querySelector(".modal__close-button");

editProfileButton.addEventListener("click", function () {
  editProfileModal.classList.add("modal__is-open");
});
editProfileCloseButton.addEventListener("click", function () {
  editProfileModal.classList.remove("modal__is-open");
});
const newPostButton = document.querySelector(".profile__new-post-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostModalCloseButton = newPostModal.querySelector(".modal__close-button");

newPostButton.addEventListener("click", function () {
  newPostModal.classList.add("modal__is-open");
});
newPostModalCloseButton.addEventListener("click", function () {
  newPostModal.classList.remove("modal__is-open");
});
