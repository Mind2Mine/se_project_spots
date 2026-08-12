export function setButtonText(
  submitButton,
  isLoading,
  loadingText = "Saving...",
  deafaultText = "Save",
) {
  if (isLoading) {
    submitButton.textContent = loadingText;
  } else {
    submitButton.textContent = deafaultText;
  }
}
1;
