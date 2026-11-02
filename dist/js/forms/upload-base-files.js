/**
 * Загрузка файлов базы
 * ------------------------------------------------------------
 * .upload-base-files — drag&drop, список файлов, ошибки.
 *
 * Класс:      UploadBaseFiles
 * Включается: если на странице есть `.upload-base-files`
 * Зависит от: core/shared-refs, forms/form-validate
 * Страницы:   databases, subscriptions
 */

class UploadBaseFiles {
  static init() {
    if (uploadContainer) {
      const fileInput = uploadContainer.querySelector('input[type="file"]');
      const dropZone = uploadContainer.querySelector('.upload-base-file1');
      const resultsContainer = uploadContainer.querySelector('.upload-base-files__results');
      const maxFileAttr = dropZone ? dropZone.getAttribute('data-max-file') : null;
      const maxFileCount = maxFileAttr ? parseInt(maxFileAttr, 10) : 4;
      const maxFileSize = 5 * 1024 * 1024;

      let filesList = [];
      let activeTimeouts = [];
      let isProcessing = false;
      let isUploading = false;

      const errorsList = uploadContainer.querySelectorAll('.upload-base-files__error');
      const sizeError = errorsList[0] || null;
      const countError = errorsList[1] || null;
      const emptyError = errorsList[2] || null;
      const lineParent = uploadContainer.querySelector('.upload-base-file2');
      const loadingText = uploadContainer.querySelector('p');

      if (lineParent) {
        const existingLine = lineParent.querySelector('.line');
        if (existingLine) {
          existingLine.remove();
        }
      }

      if (errorsList.length > 0) {
        errorsList.forEach(error => {
          if (error) error.style.display = 'none';
        });
      }

      if (resultsContainer) {
        const existingResults = resultsContainer.querySelectorAll('.upload-base-files__result');
        if (existingResults.length === 0) {
          resultsContainer.classList.remove('active');
        } else {
          resultsContainer.classList.add('active');
        }
      }

      if (loadingText) {
        loadingText.style.display = 'none';
      }

      function getButtons() {
        const popupStep = uploadContainer.closest('.popup__step');
        if (!popupStep) return { nextBtn: null, prevBtn: null };

        const nextBtn = popupStep.querySelector('.btn-next');
        const prevBtn = popupStep.querySelector('.popup-buttons__arrow, .btn-prev');

        return { nextBtn, prevBtn };
      }

      function disableButtons() {
        const { nextBtn, prevBtn } = getButtons();
        if (nextBtn) {
          nextBtn.disabled = true;
          nextBtn.style.pointerEvents = 'none';
          nextBtn.style.opacity = '0.5';
        }
        if (prevBtn) {
          prevBtn.disabled = true;
          prevBtn.style.pointerEvents = 'none';
          prevBtn.style.opacity = '0.5';
        }
      }

      function enableButtons() {
        const { nextBtn, prevBtn } = getButtons();
        if (nextBtn) {
          nextBtn.disabled = false;
          nextBtn.style.pointerEvents = '';
          nextBtn.style.opacity = '';
        }
        if (prevBtn) {
          prevBtn.disabled = false;
          prevBtn.style.pointerEvents = '';
          prevBtn.style.opacity = '';
        }
      }

      function clearAllFormErrors() {
        if (fileInput) {
          fileInput.classList.remove('_form-error');
          fileInput.classList.add('_form-success');
        }
        if (dropZone) {
          dropZone.classList.remove('_form-error');
          dropZone.classList.add('_form-success');
        }

        const uploadBaseFilesItem = uploadContainer.querySelector('.upload-base-files__item');
        if (uploadBaseFilesItem) {
          uploadBaseFilesItem.classList.remove('_form-error');
          uploadBaseFilesItem.classList.add('_form-success');
        }

        const errorContainer = dropZone || fileInput;
        if (errorContainer) {
          const allErrorContainers = FormValidate.getAllErrorContainers(errorContainer);
          allErrorContainers.forEach(container => {
            container.classList.remove('_form-error');
            container.classList.add('_form-success');
          });

          const parent = errorContainer.parentElement;
          if (parent) {
            const innerError = parent.querySelector('.form__error');
            if (innerError) innerError.remove();

            let nextEl = parent.nextElementSibling;
            if (nextEl && nextEl.classList.contains('form__error')) {
              nextEl.remove();
            }
          }
        }
      }

      function showEmptyError() {
        hideAllErrors();
        if (emptyError) emptyError.style.display = 'block';

        if (fileInput) {
          fileInput.classList.remove('_form-success');
          fileInput.classList.add('_form-error');
        }
        if (dropZone) {
          dropZone.classList.remove('_form-success');
          dropZone.classList.add('_form-error');
        }
        const uploadBaseFilesItem = uploadContainer.querySelector('.upload-base-files__item');
        if (uploadBaseFilesItem) {
          uploadBaseFilesItem.classList.remove('_form-success');
          uploadBaseFilesItem.classList.add('_form-error');
        }
      }

      window.showUploadEmptyError = showEmptyError;

      function addActiveToContainer() {
        uploadContainer.classList.add('active');
        const timeout = setTimeout(() => {
          uploadContainer.classList.remove('active');
        }, 5000);
        activeTimeouts.push(timeout);
      }

      function updateUI() {
        if (resultsContainer) {
          if (filesList.length > 0) {
            resultsContainer.classList.add('active');
          } else {
            resultsContainer.classList.remove('active');
          }
        }

        if (filesList.length > 0) {
          clearAllFormErrors();
        } else {
          if (fileInput) {
            fileInput.classList.remove('_form-success');
            fileInput.classList.add('_form-error');
          }
          if (dropZone) {
            dropZone.classList.remove('_form-success');
            dropZone.classList.add('_form-error');
          }
          const uploadBaseFilesItem = uploadContainer.querySelector('.upload-base-files__item');
          if (uploadBaseFilesItem) {
            uploadBaseFilesItem.classList.remove('_form-success');
            uploadBaseFilesItem.classList.add('_form-error');
          }
        }
      }

      function hideAllErrors() {
        if (sizeError) sizeError.style.display = 'none';
        if (countError) countError.style.display = 'none';
        if (emptyError) emptyError.style.display = 'none';
      }

      function validateFiles(files) {
        const newFiles = [];
        const errors = [];

        hideAllErrors();

        if (filesList.length + files.length > maxFileCount) {
          errors.push('count');
          if (countError) countError.style.display = 'block';
          return { newFiles: [], errors };
        }

        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          if (file.size > maxFileSize) {
            if (sizeError) sizeError.style.display = 'block';
            errors.push('size');
            continue;
          }

          newFiles.push(file);
        }

        return { newFiles, errors };
      }

      function createAndAnimateLine(fileIndex, totalFiles) {
        if (!lineParent) return null;

        const line = document.createElement('div');
        line.className = 'line';

        const span = document.createElement('span');
        span.style.width = '0%';
        span.style.transition = 'width 5s ease';
        line.appendChild(span);

        lineParent.appendChild(line);

        setTimeout(() => {
          if (span) {
            span.style.width = '100%';
          }
        }, fileIndex * 100);

        setTimeout(() => {
          if (line && line.parentNode) {
            line.remove();
          }
        }, 5000 + (fileIndex * 100));

        return line;
      }

      function addFilesToUI(files) {
        if (!resultsContainer) return;

        const existingCount = resultsContainer.querySelectorAll('.upload-base-files__result').length;

        files.forEach((file, index) => {
          const resultItem = document.createElement('div');
          resultItem.className = 'upload-base-files__result';

          const nameDiv = document.createElement('div');
          nameDiv.className = 'upload-base-files__name';
          nameDiv.textContent = `${existingCount + index + 1} - ${file.name}`;

          const separatorSpan = document.createElement('span');
          separatorSpan.textContent = '-';

          const deleteDiv = document.createElement('div');
          deleteDiv.className = 'upload-base-files__delete';
          deleteDiv.textContent = 'Удалить';

          resultItem.appendChild(nameDiv);
          resultItem.appendChild(separatorSpan);
          resultItem.appendChild(deleteDiv);

          resultsContainer.appendChild(resultItem);
        });
      }

      function updateFileNames() {
        if (!resultsContainer) return;

        const results = resultsContainer.querySelectorAll('.upload-base-files__result');
        results.forEach((result, idx) => {
          const nameDiv = result.querySelector('.upload-base-files__name');
          if (nameDiv && filesList[idx]) {
            const fileName = filesList[idx].name;
            nameDiv.textContent = `${idx + 1} - ${fileName}`;
          }
        });
      }

      function updateFileInput() {
        if (!fileInput) return;

        const dataTransfer = new DataTransfer();
        filesList.forEach(file => {
          if (file.file) {
            dataTransfer.items.add(file.file);
          }
        });
        fileInput.files = dataTransfer.files;
      }

      function deleteFile(resultItem) {
        if (!resultItem) return;

        const allResults = resultsContainer.querySelectorAll('.upload-base-files__result');
        const indexToRemove = Array.from(allResults).indexOf(resultItem);

        if (indexToRemove !== -1) {
          filesList.splice(indexToRemove, 1);
          resultItem.remove();
          updateFileNames();
          updateUI();
          updateFileInput();
        }
      }

      function processFiles(files) {
        if (isProcessing) {
          return;
        }

        isProcessing = true;
        isUploading = true;
        hideAllErrors();
        disableButtons();

        if (loadingText) {
          loadingText.style.display = 'block';
        }

        const { newFiles, errors } = validateFiles(files);

        if (errors.length > 0) {
          isProcessing = false;
          isUploading = false;
          enableButtons();
          if (loadingText) {
            loadingText.style.display = 'none';
          }
          if (fileInput) fileInput.value = '';
          return;
        }

        if (newFiles.length === 0) {
          isProcessing = false;
          isUploading = false;
          enableButtons();
          if (loadingText) {
            loadingText.style.display = 'none';
          }
          if (fileInput) fileInput.value = '';
          return;
        }

        window.hasAttemptedUpload = true;
        addActiveToContainer();

        newFiles.forEach((file, index) => {
          createAndAnimateLine(index, newFiles.length);
        });

        newFiles.forEach(file => {
          const fileObj = {
            name: file.name,
            size: file.size,
            type: file.type,
            file: file
          };
          filesList.push(fileObj);
        });

        addFilesToUI(newFiles);
        updateUI();
        updateFileInput();
        clearAllFormErrors();

        if (fileInput) fileInput.value = '';

        setTimeout(() => {
          isProcessing = false;
          isUploading = false;
          enableButtons();
          if (loadingText) {
            loadingText.style.display = 'none';
          }
        }, 5000);
      }

      if (fileInput) {
        fileInput.addEventListener('change', function (e) {
          if (this.files && this.files.length > 0) {
            processFiles(Array.from(this.files));
          }
        });
      }

      if (dropZone) {
        dropZone.addEventListener('dragover', (e) => {
          e.preventDefault();
          if (!isUploading) {
            dropZone.classList.add('drag-over');
          }
        });

        dropZone.addEventListener('dragleave', (e) => {
          e.preventDefault();
          dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
          e.preventDefault();
          dropZone.classList.remove('drag-over');
          if (!isUploading) {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
              processFiles(Array.from(files));
            }
          }
        });
      }

      if (resultsContainer) {
        resultsContainer.addEventListener('click', function (e) {
          if (isUploading) return;

          const deleteBtn = e.target.closest('.upload-base-files__delete');
          if (deleteBtn) {
            const resultItem = deleteBtn.closest('.upload-base-files__result');
            deleteFile(resultItem);
          }
        });
      }

      updateUI();
    }
  }
}

UploadBaseFiles.init();
