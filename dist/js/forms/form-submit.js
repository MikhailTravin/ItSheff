/**
 * Отправка форм
 * ------------------------------------------------------------
 * Перехват submit, валидация, показ успеха/ошибки, переход к следующему шагу попапа.
 *
 * Класс:      FormSubmit
 * Включается: если на странице есть `form` или `button.btn-next[data-popup]`
 * Зависит от: forms/form-validate, popups/popup, core/scroll-to, core/helpers, core/shared-refs
 * Страницы:   20 из 29 (все, кроме: account-blocked, databases-empty, documents-detail1, documents-detail2, documents, invoices-empty, loader-progress, subscriptions-restoring, subscriptions-restoring2)
 */

class FormSubmit {
  static init() {
    document.addEventListener('click', function (e) {
      const targetElement = e.target.closest('.btn-next');
      if (!targetElement) return;

      const form = targetElement.closest('form');
      if (!form) return;

      if (form.classList.contains('popup-upload-base')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const fileInput = form.querySelector('input[type="file"][data-required]');
        const uploadContainer = form.querySelector('.upload-base-files');

        if (uploadContainer) {
          const resultsContainer = uploadContainer.querySelector('.upload-base-files__results');
          const resultItems = resultsContainer ? resultsContainer.querySelectorAll('.upload-base-files__result') : [];
          const hasFiles = resultItems.length > 0;

          const allErrors = uploadContainer.querySelectorAll('.upload-base-files__error');
          allErrors.forEach(error => {
            error.style.display = 'none';
          });

          if (!hasFiles) {
            const emptyError = uploadContainer.querySelector('.not-added-database');
            if (emptyError) {
              emptyError.style.display = 'block';
              emptyError.style.cssText = 'display: block !important';
            } else {
              const anyError = uploadContainer.querySelector('.upload-base-files__error');
              if (anyError) {
                anyError.style.display = 'block';
              }
            }

            if (fileInput) {
              fileInput.classList.remove('_form-success');
              fileInput.classList.add('_form-error');
            }

            const dropZone = uploadContainer.querySelector('.upload-base-file1');
            if (dropZone) {
              dropZone.classList.remove('_form-success');
              dropZone.classList.add('_form-error');
            }

            const uploadBaseFilesItem = uploadContainer.querySelector('.upload-base-files__item');
            if (uploadBaseFilesItem) {
              uploadBaseFilesItem.classList.remove('_form-success');
              uploadBaseFilesItem.classList.add('_form-error');
            }

            return false;
          } else {
            if (fileInput) {
              fileInput.classList.remove('_form-error');
              fileInput.classList.add('_form-success');
            }

            const dropZone = uploadContainer.querySelector('.upload-base-file1');
            if (dropZone) {
              dropZone.classList.remove('_form-error');
            }

            const uploadBaseFilesItem = uploadContainer.querySelector('.upload-base-files__item');
            if (uploadBaseFilesItem) {
              uploadBaseFilesItem.classList.remove('_form-error');
            }

            const popupElement = form.closest('.popup');
            if (popupElement && typeof modules_flsModules !== 'undefined' && modules_flsModules.popup) {
              modules_flsModules.popup.nextStep(popupElement);
            } else {
              const currentStep = form.closest('.popup__step');
              if (currentStep) {
                currentStep.style.display = 'none';
                const nextStep = currentStep.parentElement.querySelector('.popup__step:not(.active)');
                if (nextStep) {
                  nextStep.style.display = 'block';
                  nextStep.classList.add('active');
                }
              }
            }
          }
        }

        return false;
      }
    }, true);

    const forms = document.forms;
    if (forms.length) {
      for (const form of forms) {
        form.addEventListener('submit', function (e) {
          const formTarget = e.target;
          const submitButton = formTarget.querySelector('button[type="submit"]:focus') || formTarget.querySelector('button[type="submit"].btn-next');

          if (submitButton && submitButton.hasAttribute('data-btn') && submitButton.type === 'submit') {
            e.preventDefault();
            e.stopPropagation();

            const popupElement = form.closest('.popup');

            const error = !form.hasAttribute('data-no-validate') ? FormValidate.getErrors(form) : 0;

            if (error === 0) {
              if (popupElement && typeof modules_flsModules !== 'undefined' && modules_flsModules.popup) {
                modules_flsModules.popup.close(popupElement);
                setTimeout(() => {
                  modules_flsModules.popup.showBtnByDataAttribute(popupElement);
                }, 100);
              }
            } else {
              if (form.querySelector('._form-error')) {
                const firstError = form.querySelector('._form-error');
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
              }
            }
            return;
          }

          if (submitButton && submitButton.classList.contains('btn-next') && submitButton.closest('.popup')) {
            e.preventDefault();
            e.stopPropagation();

            const popupElement = form.closest('.popup');
            const currentStep = submitButton.closest('.popup-details-tabs__step') || submitButton.closest('.popup__step');

            const fileInput = form.querySelector('input[type="file"][data-required]');

            if (fileInput) {
              const uploadContainer = fileInput.closest('.upload-base-files');

              if (uploadContainer) {
                const resultsContainer = uploadContainer.querySelector('.upload-base-files__results');
                const resultItems = resultsContainer ? resultsContainer.querySelectorAll('.upload-base-files__result') : [];
                const hasFiles = resultItems.length > 0;

                if (!hasFiles) {
                  const allErrors = uploadContainer.querySelectorAll('.upload-base-files__error');

                  allErrors.forEach(error => {
                    if (error) {
                      error.style.display = 'none';
                    }
                  });

                  const emptyError = uploadContainer.querySelector('.not-added-database');

                  if (emptyError) {
                    emptyError.style.display = 'block';
                    emptyError.style.cssText = 'display: block !important';
                  } else {
                    const anyError = uploadContainer.querySelector('.upload-base-files__error');
                    if (anyError) {
                      anyError.style.display = 'block';
                    }
                  }

                  if (fileInput) {
                    fileInput.classList.remove('_form-success');
                    fileInput.classList.add('_form-error');
                  }

                  const dropZone = uploadContainer.querySelector('.upload-base-file1');
                  if (dropZone) {
                    dropZone.classList.remove('_form-success');
                    dropZone.classList.add('_form-error');
                  }

                  const uploadBaseFilesItem = uploadContainer.querySelector('.upload-base-files__item');
                  if (uploadBaseFilesItem) {
                    uploadBaseFilesItem.classList.remove('_form-success');
                    uploadBaseFilesItem.classList.add('_form-error');
                  }

                  return;
                } else {
                  const allErrors = uploadContainer.querySelectorAll('.upload-base-files__error');
                  allErrors.forEach(error => {
                    if (error) error.style.display = 'none';
                  });

                  fileInput.classList.remove('_form-error');
                  fileInput.classList.add('_form-success');

                  const dropZone = uploadContainer.querySelector('.upload-base-file1');
                  if (dropZone) dropZone.classList.remove('_form-error');

                  const uploadBaseFilesItem = uploadContainer.querySelector('.upload-base-files__item');
                  if (uploadBaseFilesItem) uploadBaseFilesItem.classList.remove('_form-error');
                }
              }
            }

            let validationTarget;
            if (currentStep) {
              if (currentStep.classList.contains('popup__step') && currentStep.tagName === 'FORM') {
                validationTarget = form;
              } else if (currentStep.classList.contains('popup-details-tabs__step')) {
                validationTarget = currentStep;
              } else {
                validationTarget = form;
              }
            } else {
              validationTarget = form;
            }

            const error = !form.hasAttribute('data-no-validate') ? FormValidate.getErrors(validationTarget) : 0;

            if (error === 0) {
              if (submitButton.hasAttribute('data-btn')) {
                if (popupElement && typeof modules_flsModules !== 'undefined' && modules_flsModules.popup) {
                  modules_flsModules.popup.close(popupElement);
                  setTimeout(() => {
                    modules_flsModules.popup.showBtnByDataAttribute(popupElement);
                  }, 100);
                }
              } else {
                if (popupElement && typeof modules_flsModules !== 'undefined' && modules_flsModules.popup) {
                  modules_flsModules.popup.nextStep(popupElement);
                }
              }
            } else {
              if (validationTarget.querySelector('._form-error')) {
                const firstError = validationTarget.querySelector('._form-error');
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
              }
            }

            return;
          }

          formSubmitAction(form, e);
        });

        form.addEventListener('reset', function (e) {
          const form = e.target;
          FormValidate.formClean(form);
        });
      }
    }

    document.addEventListener('click', function (e) {
      const targetElement = e.target.closest('.btn-details-next, .btn-next');

      if (!targetElement) return;

      if (targetElement.closest('.popup') && (targetElement.classList.contains('btn-next') || targetElement.classList.contains('btn-details-next'))) {

        if (targetElement.hasAttribute('data-btn')) {
          e.preventDefault();
          e.stopPropagation();

          const popupElement = targetElement.closest('.popup');
          const form = targetElement.closest('form');

          if (form) {
            const error = !form.hasAttribute('data-no-validate') ? FormValidate.getErrors(form) : 0;

            if (error === 0) {
              if (popupElement && typeof modules_flsModules !== 'undefined' && modules_flsModules.popup) {
                modules_flsModules.popup.close(popupElement);
                setTimeout(() => {
                  modules_flsModules.popup.showBtnByDataAttribute(popupElement);
                }, 100);
              }
            } else {
              if (form.querySelector('._form-error')) {
                const firstError = form.querySelector('._form-error');
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
              }
            }
          } else {
            if (popupElement && typeof modules_flsModules !== 'undefined' && modules_flsModules.popup) {
              modules_flsModules.popup.close(popupElement);
              setTimeout(() => {
                modules_flsModules.popup.showBtnByDataAttribute(popupElement);
              }, 100);
            }
          }
          return;
        }

        const form = targetElement.closest('form');
        const popupElement = targetElement.closest('.popup');

        if (!form) {
          e.preventDefault();
          e.stopPropagation();

          if (targetElement.hasAttribute('data-btn')) {
            if (popupElement && typeof modules_flsModules !== 'undefined' && modules_flsModules.popup) {
              modules_flsModules.popup.close(popupElement);
              setTimeout(() => {
                modules_flsModules.popup.showBtnByDataAttribute(popupElement);
              }, 100);
            }
          } else {
            if (popupElement && typeof modules_flsModules !== 'undefined' && modules_flsModules.popup) {
              modules_flsModules.popup.nextStep(popupElement);
            }
          }
          return;
        }

        if (targetElement.type === 'submit') {
          return;
        }

        const currentStep = targetElement.closest('.popup-details-tabs__step');

        if (currentStep) {
          e.preventDefault();
          e.stopPropagation();

          const steps = Array.from(form.querySelectorAll('.popup-details-tabs__step'));
          const currentIndex = steps.indexOf(currentStep);

          if (currentIndex < steps.length - 1) {
            const error = !form.hasAttribute('data-no-validate') ? FormValidate.getErrors(currentStep) : 0;

            if (error === 0) {
              currentStep.classList.remove('active');
              currentStep.style.display = 'none';

              const nextStep = steps[currentIndex + 1];
              nextStep.classList.add('active');
              nextStep.style.display = '';

              const pagination = document.querySelector('.popup-details-pagination');
              if (pagination) {
                const paginationTitles = pagination.querySelectorAll('.popup-details-pagination__title');
                paginationTitles.forEach((title, idx) => {
                  if (idx === currentIndex + 1) {
                    title.classList.add('active');
                  } else {
                    title.classList.remove('active');
                  }
                });
              }
            } else {
              if (currentStep.querySelector('._form-error')) {
                const firstError = currentStep.querySelector('._form-error');
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
              }
            }
          }
        } else {
          const error = !form.hasAttribute('data-no-validate') ? FormValidate.getErrors(form) : 0;

          if (error === 0) {
            const popupAttribute = targetElement.dataset.popup;
            if (popupAttribute) {
              if (typeof modules_flsModules !== 'undefined' && modules_flsModules.popup) {
                modules_flsModules.popup.open(popupAttribute);
              }
              FormValidate.formClean(form);
            } else {
              form.requestSubmit();
            }
          } else {
            if (form.querySelector('._form-error')) {
              const firstError = form.querySelector('._form-error');
              firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
              firstError.focus();
            }
          }
        }

        return;
      }

      const form = targetElement.closest('form');
      if (!form) return;

      if (targetElement.type === 'submit') return;

      e.preventDefault();
      e.stopPropagation();

      const currentStep = targetElement.closest('.popup-details-tabs__step');

      if (currentStep) {
        const steps = Array.from(form.querySelectorAll('.popup-details-tabs__step'));
        const currentIndex = steps.indexOf(currentStep);

        if (currentIndex < steps.length - 1) {
          const error = !form.hasAttribute('data-no-validate') ? FormValidate.getErrors(currentStep) : 0;

          if (error === 0) {
            currentStep.classList.remove('active');
            currentStep.style.display = 'none';

            const nextStep = steps[currentIndex + 1];
            nextStep.classList.add('active');
            nextStep.style.display = '';

            const pagination = document.querySelector('.popup-details-pagination');
            if (pagination) {
              const paginationTitles = pagination.querySelectorAll('.popup-details-pagination__title');
              paginationTitles.forEach((title, index) => {
                if (index === currentIndex + 1) {
                  title.classList.add('active');
                } else {
                  title.classList.remove('active');
                }
              });
            }
          } else {
            if (currentStep.querySelector('._form-error')) {
              const firstError = currentStep.querySelector('._form-error');
              firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
              firstError.focus();
            }
          }
        }
      } else {
        const error = !form.hasAttribute('data-no-validate') ? FormValidate.getErrors(form) : 0;

        if (error === 0) {
          const popupAttribute = targetElement.dataset.popup;
          if (popupAttribute) {
            if (typeof modules_flsModules !== 'undefined' && modules_flsModules.popup) {
              modules_flsModules.popup.open(popupAttribute);
            }
            FormValidate.formClean(form);
          } else {
            form.requestSubmit();
          }
        } else {
          if (form.querySelector('._form-error')) {
            const firstError = form.querySelector('._form-error');
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
          }
        }
      }
    });

    async function formSubmitAction(form, e) {
      const error = !form.hasAttribute('data-no-validate') ? FormValidate.getErrors(form) : 0;

      if (error === 0) {
        const submitButton = form.querySelector('button[type="submit"]');
        const isThanksButton = submitButton && submitButton.classList.contains('btn-thanks');

        if (isThanksButton) {
          e.preventDefault();

          const popupContainer = form.closest('.popup');
          if (popupContainer) {
            const popupEditDetails = popupContainer.querySelector('.popup-edit-details');
            const popupThanks = popupContainer.querySelector('.popup-thanks');

            if (popupEditDetails && popupThanks) {
              popupEditDetails.style.display = 'none';
              popupThanks.style.display = 'block';
              popupThanks.setAttribute('aria-hidden', 'false');
            }
          }

          FormValidate.formClean(form);

          const tabsContainer = document.querySelector('.popup-details-tabs');
          if (tabsContainer) {
            const paginationBlock = tabsContainer.querySelector('.popup-details-pagination');
            if (paginationBlock) {
              paginationBlock.style.display = 'grid';
            }
          }

          return;
        }

        const ajax = form.hasAttribute('data-ajax');
        if (ajax) {
          e.preventDefault();
          const formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
          const formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
          const formData = new FormData(form);

          form.classList.add('_sending');
          const response = await fetch(formAction, {
            method: formMethod,
            body: formData
          });
          if (response.ok) {
            let responseResult = await response.json();
            form.classList.remove('_sending');
            formSent(form, responseResult);
          } else {
            alert("Помилка");
            form.classList.remove('_sending');
          }
        } else if (form.hasAttribute('data-dev')) {
          e.preventDefault();
          formSent(form);
        }
      } else {
        e.preventDefault();
        if (form.querySelector('._form-error') && form.hasAttribute('data-goto-error')) {
          const formGoToErrorClass = form.dataset.gotoError ? form.dataset.gotoError : '._form-error';
          gotoBlock(formGoToErrorClass, true, 1000);
        }
      }
    }

    function formSent(form, responseResult = ``) {
      document.dispatchEvent(new CustomEvent("formSent", {
        detail: {
          form: form
        }
      }));

      const telephoneInputs = form.querySelectorAll('.telephone');
      telephoneInputs.forEach(input => {
        const parent = input.closest('.form__input');
        if (parent) {
          parent.classList.remove('filled');
        }
      });

      setTimeout(() => {
        if (modules_flsModules && modules_flsModules.popup) {
          const popup = form.dataset.popupMessage;
          popup ? modules_flsModules.popup.open(popup) : null;
        }
      }, 0);

      FormValidate.formClean(form);
    }
  }
}

FormSubmit.init();

document.addEventListener('click', function (e) {
  const targetElement = e.target.closest('button[data-popup].btn-next');
  if (!targetElement) return;

  const form = targetElement.closest('form');
  if (!form) return;

  if (targetElement.closest('.popup-details-tabs__step')) return;

  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  const error = !form.hasAttribute('data-no-validate') ? FormValidate.getErrors(form) : 0;

  if (error === 0) {
    const popupAttribute = targetElement.dataset.popup;
    if (popupAttribute && typeof modules_flsModules !== 'undefined' && modules_flsModules.popup) {
      modules_flsModules.popup.open(popupAttribute);
    }
    FormValidate.formClean(form);
  } else {
    const firstError = form.querySelector('._form-error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstError.focus();
    }
  }
}, true);
