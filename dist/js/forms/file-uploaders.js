/**
 * Загрузка файлов и запись аудио
 * ------------------------------------------------------------
 * Прикрепление файлов к textarea, запись аудио (AudioRecorder).
 *
 * Класс:      FileUploaders
 * Включается: если на странице есть `.form-textarea__bottom` или `.audio-record` или `.file-input`
 * Зависит от: —
 * Страницы:   loader, support
 */

class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.recordingStartTime = null;
    this.timerInterval = null;
    this.onStopCallback = null;
  }

  async startRecording() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioFile = this.createAudioFile();
        if (this.onStopCallback) {
          this.onStopCallback(audioFile);
        }
      };

      this.mediaRecorder.start(100);
      this.recordingStartTime = Date.now();
      this.startTimer();

      return true;
    } catch (error) {
      console.error('Ошибка доступа к микрофону:', error);
      alert('Не удалось получить доступ к микрофону. Пожалуйста, проверьте разрешения.');
      return false;
    }
  }

  startTimer() {
    const timeElement = document.querySelector('.recording-time');
    if (timeElement && this.timerInterval === null) {
      this.timerInterval = setInterval(() => {
        if (this.recordingStartTime) {
          const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
          const minutes = Math.floor(elapsed / 60);
          const seconds = elapsed % 60;
          timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
      }, 1000);
    }
  }

  stopRecording() {
    return new Promise((resolve) => {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        const originalCallback = this.onStopCallback;
        this.onStopCallback = (audioFile) => {
          if (originalCallback) originalCallback(audioFile);
          resolve(audioFile);
        };

        this.mediaRecorder.stop();

        if (this.timerInterval) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
        }

        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = null;
        }
      } else {
        resolve(null);
      }
    });
  }

  createAudioFile() {
    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
    const audioFile = new File([audioBlob], `recording_${Date.now()}.webm`, {
      type: 'audio/webm',
      lastModified: Date.now()
    });
    return audioFile;
  }

  setOnStopCallback(callback) {
    this.onStopCallback = callback;
  }
}

/** Прикрепление файлов и запись аудио в .form-textarea */
class FileUploaders {
  static init() {
    const formTextarea = document.querySelectorAll('.form-textarea__bottom');

    formTextarea.forEach(container => {
      const resultsContainer = container.querySelector('.form-textarea__results');
      const audioRecordBtn = container.querySelector('.audio-record .record-button');
      const recordingIndicator = container.querySelector('.recording-indicator');
      const stopRecordingBtn = container.querySelector('.stop-recording');
      const fileInput = container.querySelector('.file-input input[type="file"]');

      if (!resultsContainer) return;

      const recorder = new AudioRecorder();
      let isRecording = false;

      function updateResultsActive() {
        if (resultsContainer.children.length > 0) {
          resultsContainer.classList.add('active');
        } else {
          resultsContainer.classList.remove('active');
        }
      }

      function animateTitle(titleElement, closeElement) {
        if (!titleElement) return;

        if (closeElement) {
          closeElement.style.opacity = '0';
          closeElement.style.pointerEvents = 'none';
        }

        titleElement.classList.add('active');

        setTimeout(() => {
          titleElement.classList.remove('active');

          if (closeElement) {
            closeElement.style.opacity = '1';
            closeElement.style.pointerEvents = 'auto';
          }
        }, 5000);
      }

      function createFileBlock(file, type) {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'form-textarea__result';

        let iconHtml = '';
        if (type === 'audio') {
          iconHtml = `
                    <svg aria-hidden="true" width="10" height="15">
                        <use xlink:href="img/sprite.svg#mic-voice"></use>
                    </svg>
                `;
        } else {
          iconHtml = `
                    <svg aria-hidden="true" width="14" height="16">
                        <use xlink:href="img/sprite.svg#documents"></use>
                    </svg>
                `;
        }

        const closeHtml = `
                <svg aria-hidden="true" width="10" height="10">
                    <use xlink:href="img/sprite.svg#close"></use>
                </svg>
            `;

        resultDiv.innerHTML = `
                <div class="form-textarea__titles">
                    <div class="form-textarea__icon">
                        ${iconHtml}
                    </div>
                    <div class="form-textarea__title">
                        <span class="text">${escapeHtml(file.name)}</span>
                        <div class="line">
                            <span></span>
                        </div>
                    </div>
                </div>
                <div class="form-textarea__close" style="opacity: 0; pointer-events: none; transition: opacity 0.3s ease;">
                    ${closeHtml}
                </div>
            `;

        const titleDiv = resultDiv.querySelector('.form-textarea__title');
        const closeDiv = resultDiv.querySelector('.form-textarea__close');

        if (closeDiv) {
          closeDiv.addEventListener('click', () => {
            resultDiv.remove();
            updateResultsActive();
          });
        }

        return { resultDiv, titleDiv, closeDiv };
      }

      function addAudioFile(audioFile) {
        if (!audioFile) return;
        const { resultDiv, titleDiv, closeDiv } = createFileBlock(audioFile, 'audio');
        resultsContainer.appendChild(resultDiv);
        animateTitle(titleDiv, closeDiv);
        updateResultsActive();
      }

      function escapeHtml(str) {
        return str.replace(/[&<>]/g, function (m) {
          if (m === '&') return '&amp;';
          if (m === '<') return '&lt;';
          if (m === '>') return '&gt;';
          return m;
        });
      }

      recorder.setOnStopCallback((audioFile) => {
        addAudioFile(audioFile);
        if (audioRecordBtn && recordingIndicator) {
          audioRecordBtn.style.display = 'flex';
          recordingIndicator.style.display = 'none';
        }
        isRecording = false;
      });

      if (audioRecordBtn && recordingIndicator) {
        audioRecordBtn.addEventListener('click', async () => {
          if (isRecording) return;

          audioRecordBtn.style.display = 'none';
          recordingIndicator.style.display = 'flex';

          const timeElement = container.querySelector('.recording-time');
          if (timeElement) timeElement.textContent = '00:00';

          const started = await recorder.startRecording();
          if (started) {
            isRecording = true;
          } else {
            audioRecordBtn.style.display = 'flex';
            recordingIndicator.style.display = 'none';
          }
        });
      }

      if (stopRecordingBtn) {
        stopRecordingBtn.addEventListener('click', async () => {
          if (isRecording) {
            await recorder.stopRecording();
          }
        });
      }

      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          const files = Array.from(e.target.files);
          files.forEach(file => {
            const { resultDiv, titleDiv, closeDiv } = createFileBlock(file, 'document');
            resultsContainer.appendChild(resultDiv);
            animateTitle(titleDiv, closeDiv);
          });
          updateResultsActive();
          fileInput.value = '';
        });
      }

      updateResultsActive();
    });
  }
}

FileUploaders.init();
