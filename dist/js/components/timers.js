/**
 * Таймеры
 * ------------------------------------------------------------
 * .timer — обратный отсчёт и ввод времени.
 *
 * Класс:      Timers
 * Включается: если на странице есть `.timer`
 * Зависит от: —
 * Страницы:   databases
 */

class Timers {
  static init() {
    const timers = document.querySelectorAll('.timer');

    if (timers) {
      timers.forEach((timer) => {
        const timerInput = timer.querySelector('.timer__input');
        const timerValue = timer.querySelector('.timer__value');
        const timerContent = timer.querySelector('.timer__content');
        const timerItems = timer.querySelectorAll('.timer__item');
        const inputField = timer.querySelector('.input-timer');
        const timerIcon = timer.querySelector('.timer__icon');

        let currentValue = '';

        function updateDisplayValue(time) {
          if (timerValue) {
            timerValue.innerHTML = time.replace(':', ' <span>:</span> ');
          }
          if (inputField) {
            inputField.value = time;
          }
          currentValue = time;
        }

        function setActiveItem(time) {
          timerItems.forEach(item => {
            const itemTime = item.querySelector('span')?.innerText;
            if (itemTime === time) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }

        function selectTime(time) {
          updateDisplayValue(time);
          setActiveItem(time);
          closeDropdown();
        }

        function openDropdown() {
          if (timerContent) timerContent.style.display = 'block';
          timer.classList.add('active');
        }

        function closeDropdown() {
          if (timerContent) timerContent.style.display = 'none';
          timer.classList.remove('active');
        }

        function toggleDropdown() {
          if (timerContent && timerContent.style.display === 'block') {
            closeDropdown();
          } else {
            openDropdown();
          }
        }

        if (inputField) {
          inputField.addEventListener('click', function (e) {
            e.stopPropagation();
            this.value = '';
            toggleDropdown();
          });
        }

        if (timerIcon) {
          timerIcon.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleDropdown();
          });
        }

        if (timerInput) {
          timerInput.addEventListener('click', function (e) {
            if (inputField && !inputField.contains(e.target) &&
              timerIcon && !timerIcon.contains(e.target)) {
              e.stopPropagation();
              toggleDropdown();
            }
          });
        }

        timerItems.forEach(item => {
          item.addEventListener('click', function (e) {
            e.stopPropagation();
            const timeSpan = this.querySelector('span');
            if (timeSpan) {
              selectTime(timeSpan.innerText);
            }
          });
        });

        const activeItem = timer.querySelector('.timer__item.active');
        if (activeItem) {
          const defaultTime = activeItem.querySelector('span')?.innerText;
          if (defaultTime) {
            updateDisplayValue(defaultTime);
            currentValue = defaultTime;
          }
        }
      });

      document.addEventListener('click', function (e) {
        document.querySelectorAll('.timer').forEach(timer => {
          if (!timer.contains(e.target)) {
            const timerContent = timer.querySelector('.timer__content');
            if (timerContent && timerContent.style.display === 'block') {
              timerContent.style.display = 'none';
              timer.classList.remove('active');
            }
          }
        });
      });
    }
  }
}

Timers.init();
