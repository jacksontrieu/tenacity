export const showWaitCursor = (isWaiting) => {
  if (isWaiting) {
    document.body.classList.add('waiting');
  }
  else {
    document.body.classList.remove('waiting');
  }
}
