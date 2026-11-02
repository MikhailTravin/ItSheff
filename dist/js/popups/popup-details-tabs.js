/**
 * Попап «Детали»: шаги и табы
 * ------------------------------------------------------------
 * Многошаговый попап .popup-details-tabs.
 *
 * Класс:      PopupDetailsTabs
 * Включается: если на странице есть `.popup-details-tabs`
 * Зависит от: popups/popup, core/helpers, core/shared-refs, forms/form-validate
 * Страницы:   invoices-auto-payment, invoices-details, invoices, subscriptions-empty, subscriptions
 */

class PopupDetailsTabs {
  static init() {
    if (tabsContainer) {
      const paginationTitles = document.querySelectorAll('.popup-details-pagination__title');
      const paginationBlock = document.querySelector('.popup-details-pagination');
      const navigation = document.querySelector('.popup-details-tabs__navigation');
      const popupTitleP = document.querySelector('.popup__titles p');

      const matchBtn = document.querySelector('.btn-match');
      const noMatchBtn = document.querySelector('.btn-nomatch');
      const actualAddressForm = document.querySelector('.step3 .form');

      const tabButtons = document.querySelectorAll('.popup-details-tabs__title');
      const tabBodies = document.querySelectorAll('.popup-details-tabs__body');

      function getActiveTabBody() {
        for (let i = 0; i < tabBodies.length; i++) {
          if (tabBodies[i].style.display === 'block') {
            return tabBodies[i];
          }
        }
        return tabBodies[0];
      }

      function getCurrentStepForm() {
        const activeBody = getActiveTabBody();
        if (activeBody) {
          return activeBody.querySelector('.popup-details-tabs__steps');
        }
        return null;
      }

      function getCurrentSteps() {
        const form = getCurrentStepForm();
        if (form) {
          return form.querySelectorAll('.popup-details-tabs__step');
        }
        return [];
      }

      function setPaginationVisibility(visible) {
        if (paginationBlock) {
          paginationBlock.style.display = visible ? 'grid' : 'none';
        }
      }

      function updatePopupTitleFromButton(button) {
        if (popupTitleP && button) {
          const buttonText = button.textContent.trim();
          popupTitleP.textContent = buttonText;
        }
      }

      function switchTab(index) {
        tabButtons.forEach(btn => {
          btn.classList.remove('_tab-active');
        });
        if (tabButtons[index]) {
          tabButtons[index].classList.add('_tab-active');
        }

        tabBodies.forEach((body, idx) => {
          if (idx === index) {
            body.style.display = 'block';
            body.removeAttribute('hidden');
          } else {
            body.style.display = 'none';
            body.setAttribute('hidden', '');
          }
        });

        updatePopupTitleFromButton(tabButtons[index]);

        if (index !== 0) {
          setPaginationVisibility(false);
        } else {
          setPaginationVisibility(true);
          updateStep(0);
        }
      }

      function updatePopupTitleText(currentIndex) {
        if (popupTitleP && paginationTitles[currentIndex]) {
          const span = paginationTitles[currentIndex].querySelector('span');
          if (span) {
            let text = span.textContent.trim();
            if (paginationBlock && paginationBlock.style.display !== 'none') {
              popupTitleP.textContent = text;
            }
          }
        }
      }

      function toggleNavigationVisibility(currentIndex) {
        if (navigation) {
          if (currentIndex === 0) {
            navigation.style.display = 'grid';
          } else {
            navigation.style.display = 'none';
          }
        }
      }

      function setAddressFormVisible(visible) {
        if (actualAddressForm) {
          actualAddressForm.style.display = visible ? 'flex' : 'none';
        }
      }

      function setMatchActive(isMatch) {
        if (isMatch) {
          if (matchBtn) matchBtn.classList.add('active');
          if (noMatchBtn) noMatchBtn.classList.remove('active');
          setAddressFormVisible(false);
        } else {
          if (noMatchBtn) noMatchBtn.classList.add('active');
          if (matchBtn) matchBtn.classList.remove('active');
          setAddressFormVisible(true);
        }
      }

      if (matchBtn) {
        matchBtn.addEventListener('click', function (e) {
          e.preventDefault();
          setMatchActive(true);
        });
      }

      if (noMatchBtn) {
        noMatchBtn.addEventListener('click', function (e) {
          e.preventDefault();
          setMatchActive(false);
        });
      }

      function getCurrentStepIndex() {
        const steps = getCurrentSteps();
        for (let i = 0; i < steps.length; i++) {
          if (steps[i].classList.contains('active')) {
            return i;
          }
        }
        return 0;
      }

      function updatePagination(currentIndex) {
        for (let i = 0; i <= currentIndex; i++) {
          if (paginationTitles[i]) {
            paginationTitles[i].classList.add('active');
          }
        }

        for (let i = currentIndex + 1; i < paginationTitles.length; i++) {
          if (paginationTitles[i]) {
            paginationTitles[i].classList.remove('active');
          }
        }
      }

      function validateStep(step) {
        if (!step) return true;

        const form = step.closest('form');
        if (form && form.hasAttribute('data-no-validate')) return true;

        const requiredFields = step.querySelectorAll('[data-required]');
        let isValid = true;

        requiredFields.forEach(field => {
          if (field.offsetParent !== null && !field.disabled) {
            const error = FormValidate.validateInput(field);
            if (error > 0) {
              isValid = false;
            }
          }
        });

        if (!isValid) {
          const firstError = step.querySelector('._form-error');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
          }
        }

        return isValid;
      }

      function resetAllForms() {
        const popup = tabsContainer.closest('.popup');
        if (!popup) return;

        const forms = popup.querySelectorAll('form');
        forms.forEach(form => {
          FormValidate.formClean(form);
          form.reset();
        });

        const popupEditDetails = popup.querySelector('.popup-edit-details');
        const popupThanks = popup.querySelector('.popup-thanks');

        if (popupEditDetails) {
          popupEditDetails.style.display = '';
          popupEditDetails.removeAttribute('style');
        }
        if (popupThanks) {
          popupThanks.style.display = 'none';
          popupThanks.setAttribute('aria-hidden', 'true');
        }

        tabBodies.forEach((body, idx) => {
          if (idx === 0) {
            body.style.display = 'block';
            body.removeAttribute('hidden');
          } else {
            body.style.display = 'none';
            body.setAttribute('hidden', '');
          }
        });

        tabButtons.forEach((btn, idx) => {
          if (idx === 0) {
            btn.classList.add('_tab-active');
          } else {
            btn.classList.remove('_tab-active');
          }
        });

        updateStep(0);
        setPaginationVisibility(true);

        if (matchBtn && noMatchBtn) {
          matchBtn.classList.add('active');
          noMatchBtn.classList.remove('active');
          if (actualAddressForm) {
            actualAddressForm.style.display = 'none';
          }
        }

        if (popupTitleP) {
          popupTitleP.textContent = 'Субъект';
        }
      }

      document.addEventListener('click', function (e) {
        const closeButton = e.target.closest('[data-close]');
        if (closeButton) {
          const popup = closeButton.closest('.popup');
          if (popup && popup.querySelector('.popup-details-tabs')) {
            setTimeout(() => {
              resetAllForms();
            }, 300);
          }
        }
      });

      function updateStep(index) {
        const steps = getCurrentSteps();

        steps.forEach(step => {
          step.classList.remove('active');
          step.style.display = 'none';
        });

        if (steps[index]) {
          steps[index].classList.add('active');
          steps[index].style.display = '';
        }

        updatePagination(index);
        toggleNavigationVisibility(index);
        updatePopupTitleText(index);

        if (index === 2) {
          const isMatchActive = matchBtn && matchBtn.classList.contains('active');
          const isNoMatchActive = noMatchBtn && noMatchBtn.classList.contains('active');

          if (isMatchActive) {
            setMatchActive(true);
          } else if (isNoMatchActive) {
            setMatchActive(false);
          } else {
            setMatchActive(true);
          }
        }
      }

      document.addEventListener('click', function (e) {
        const targetElement = e.target.closest('.btn-details-next, .btn-next');
        if (targetElement) {
          e.preventDefault();
          e.stopPropagation();

          const form = targetElement.closest('form');
          if (!form) return;

          const currentStep = targetElement.closest('.popup-details-tabs__step');

          if (currentStep) {
            const steps = Array.from(form.querySelectorAll('.popup-details-tabs__step'));
            const currentIndex = steps.indexOf(currentStep);

            if (currentIndex < steps.length - 1) {
              if (validateStep(currentStep)) {
                currentStep.classList.remove('active');
                currentStep.style.display = 'none';

                const nextStep = steps[currentIndex + 1];
                nextStep.classList.add('active');
                nextStep.style.display = '';

                updatePagination(currentIndex + 1);
                toggleNavigationVisibility(currentIndex + 1);
                updatePopupTitleText(currentIndex + 1);

                if (currentIndex + 1 === 2) {
                  const isMatchActive = matchBtn && matchBtn.classList.contains('active');
                  const isNoMatchActive = noMatchBtn && noMatchBtn.classList.contains('active');

                  if (isMatchActive) {
                    setMatchActive(true);
                  } else if (isNoMatchActive) {
                    setMatchActive(false);
                  } else {
                    setMatchActive(true);
                  }
                }
              }
            } else {
              const isThanksButton = targetElement.classList.contains('btn-thanks');

              if (isThanksButton) {
                if (validateStep(currentStep)) {
                  const popupContainer = targetElement.closest('.popup');
                  if (popupContainer) {
                    const popupEditDetails = popupContainer.querySelector('.popup-edit-details');
                    const popupThanks = popupContainer.querySelector('.popup-thanks');

                    if (popupEditDetails && popupThanks) {
                      popupEditDetails.style.display = 'none';
                      popupThanks.style.display = 'block';
                      popupThanks.setAttribute('aria-hidden', 'false');
                    }
                  }

                  form.reset();
                  updateStep(0);
                  setPaginationVisibility(true);

                  if (matchBtn && noMatchBtn) {
                    matchBtn.classList.add('active');
                    noMatchBtn.classList.remove('active');
                    if (actualAddressForm) {
                      actualAddressForm.style.display = 'none';
                    }
                  }
                }
              } else {
                if (validateStep(currentStep)) {
                  if (targetElement.type === 'submit') {
                    const popupAttribute = targetElement.dataset.popup;
                    if (popupAttribute && typeof modules_flsModules !== 'undefined' && modules_flsModules.popup) {
                      modules_flsModules.popup.open(popupAttribute);
                      form.reset();
                    } else {
                      form.requestSubmit();
                    }
                  } else {
                    const popupAttribute = targetElement.dataset.popup;
                    if (popupAttribute && typeof modules_flsModules !== 'undefined' && modules_flsModules.popup) {
                      modules_flsModules.popup.open(popupAttribute);
                      form.reset();
                    }
                  }
                }
              }
            }
          } else {
            const isThanksButton = targetElement.classList.contains('btn-thanks');

            if (isThanksButton) {
              if (validateStep(form)) {
                const popupContainer = targetElement.closest('.popup');
                if (popupContainer) {
                  const popupEditDetails = popupContainer.querySelector('.popup-edit-details');
                  const popupThanks = popupContainer.querySelector('.popup-thanks');

                  if (popupEditDetails && popupThanks) {
                    popupEditDetails.style.display = 'none';
                    popupThanks.style.display = 'block';
                    popupThanks.setAttribute('aria-hidden', 'false');
                  }
                }
                form.reset();
              }
            } else {
              if (validateStep(form)) {
                if (targetElement.type === 'submit') {
                  const popupAttribute = targetElement.dataset.popup;
                  if (popupAttribute && typeof modules_flsModules !== 'undefined' && modules_flsModules.popup) {
                    modules_flsModules.popup.open(popupAttribute);
                    form.reset();
                  } else {
                    form.requestSubmit();
                  }
                } else {
                  const popupAttribute = targetElement.dataset.popup;
                  if (popupAttribute && typeof modules_flsModules !== 'undefined' && modules_flsModules.popup) {
                    modules_flsModules.popup.open(popupAttribute);
                    form.reset();
                  }
                }
              }
            }
          }
        }

        if (e.target.closest('.btn-details-prev')) {
          e.preventDefault();
          prevStep();
        }
      });

      function prevStep() {
        let currentIndex = getCurrentStepIndex();
        if (currentIndex > 0) {
          updateStep(currentIndex - 1);
        }
      }

      tabButtons.forEach((btn, idx) => {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          switchTab(idx);
        });
      });

      const activeTabIndex = 0;

      tabBodies.forEach((body, idx) => {
        if (idx === activeTabIndex) {
          body.style.display = 'block';
          body.removeAttribute('hidden');
        } else {
          body.style.display = 'none';
          body.setAttribute('hidden', '');
        }
      });

      if (matchBtn && matchBtn.classList.contains('active') && actualAddressForm) {
        actualAddressForm.style.display = 'none';
      }

      updateStep(0);
      setPaginationVisibility(true);
    }
  }
}

PopupDetailsTabs.init();
