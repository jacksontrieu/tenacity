export const showWaitCursor = (isWaiting) => {
  if (isWaiting) {
    document.body.classList.add('waiting');
  }
  else {
    document.body.classList.remove('waiting');
  }
}

export const toggleProgress = (inProgress, context, controllerSavingProperty = 'isSaving') => {
  // Updates the CSS 'cursor' to 'wait !important' on the <body>.
  showWaitCursor(inProgress);

  // Toggle the controller property that is responsible for determining if a
  // save operation is in progress.
  context.controller.set(controllerSavingProperty, inProgress);
};
