import "./index.css";
import { enableValidation, resetValidation } from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "ee705f33-6e31-46e3-ae3a-1236967f1c05",
    "Content-Type": "application/json",
  },
});

const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseButton = editProfileModal.querySelector(".modal__close-button");
const editProfileForm = document.forms["editProfileForm"];
const editProfileNameInput = editProfileModal.querySelector("#profile-name-input");
const editProfileDescriptionInput = editProfileModal.querySelector("#profile-description-input");

const newPostButton = document.querySelector(".profile__new-post-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostModalCloseButton = newPostModal.querySelector(".modal__close-button");

const addCardFormElement = document.forms["newPostForm"];
const linkInput = newPostModal.querySelector("#image-link");
const captionInput = newPostModal.querySelector("#card-caption-input");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileImageAvatar = document.querySelector(".profile__avatar");
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseButton = previewModal.querySelector(".modal__close-button");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");

const profileAvatarButton = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = document.forms.editAvatarForm;
const profileAvatarInput = avatarForm.elements.avatar;
const avatarModalCloseButton = avatarModal.querySelector(".modal__close-button");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const cancelButton = deleteForm.querySelector('button[type="button"]');
const deleteModalCloseButton = deleteModal.querySelector(".modal__close-button");

const cardTemplate = document.querySelector("#card-template").content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

function handleLike(evt, cardId) {
  const isLiked = evt.target.classList.contains("card__like-button_active");

  api
    .changeLike(cardId, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-button_active");
    })
    .catch(console.error);
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardLikeButton = cardElement.querySelector(".card__like-button");
  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_active");
  }

  cardLikeButton.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  cardDeleteButton.addEventListener("click", (evt) => handleDeleteCard(cardElement, data._id));

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewModalCaption.textContent = data.name;
    openModal(previewModal);
  });
  return cardElement;
}

api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach(function (item) {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    profileNameEl.textContent = user.name;
    profileDescriptionEl.textContent = user.about;
    profileImageAvatar.src = user.avatar;
  })
  .catch(console.error);

let activeModal = null;

function handleEscape(evt) {
  if (evt.key === "Escape") {
    closeModal(activeModal);
  }
}
function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(activeModal);
  }
}

function openModal(modal) {
  activeModal = modal;
  modal.classList.add("modal_is-open");

  document.addEventListener("keydown", handleEscape);
  modal.addEventListener("click", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-open");
  activeModal = null;
  document.removeEventListener("keydown", handleEscape);
  modal.removeEventListener("click", handleOverlayClick);
}

editProfileButton.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, settings);

  openModal(editProfileModal);
});
editProfileCloseButton.addEventListener("click", function () {
  closeModal(editProfileModal);
});
previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});
newPostModalCloseButton.addEventListener("click", function () {
  closeModal(newPostModal);
});
profileAvatarButton.addEventListener("click", () => {
  openModal(avatarModal);
});
avatarModalCloseButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

cancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalCloseButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  setButtonText(submitButton, true);

  api
    .editAvatarInfo({ avatar: profileAvatarInput.value })
    .then((data) => {
      profileImageAvatar.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  setButtonText(submitButton, true, "Deleting...", "Delete");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false, "Deleting...", "Delete");
    });
}
function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}
function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  setButtonText(submitButton, true);
  api
    .editUserInfo({ name: editProfileNameInput.value, about: editProfileDescriptionInput.value })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  setButtonText(submitButton, true, "Creating...", "Create");
  const cardData = {
    name: captionInput.value,
    link: linkInput.value,
  };

  api
    .addCard(cardData)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);

      evt.target.reset();
      resetValidation(evt.target, settings);
      closeModal(newPostModal);
    })

    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false, "Creating...", "Create");
    });
}
addCardFormElement.addEventListener("submit", handleAddCardSubmit);

const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};
enableValidation(settings);
