/**
 * Календарь и ввод даты
 * ------------------------------------------------------------
 * Класс DateSectionInput (ввод даты по секциям) + календари .calendar.
 *
 * Класс:      Calendars
 * Включается: если на странице есть `.calendar`
 * Зависит от: —
 * Страницы:   cart, databases, invoices-auto-payment, invoices-details, invoices, subscriptions
 */

class DateSectionInput {
  constructor(calendar, dayInput, monthInput, yearInput, validYears = []) {
    this.calendar = calendar;
    this.dayInput = dayInput;
    this.monthInput = monthInput;
    this.yearInput = yearInput;
    this.isFocused = false;
    this.skipValidation = false;
    this.isAutoSwitching = false;
    this.validYears = validYears;
    this.prevDayValue = '';
    this.prevMonthValue = '';
    this.prevYearValue = '';

    this.init();
  }

  init() {
    this.dayInput.addEventListener('input', (e) => this.handleDayInput(e));
    this.monthInput.addEventListener('input', (e) => this.handleMonthInput(e));
    this.yearInput.addEventListener('input', (e) => this.handleYearInput(e));

    this.dayInput.addEventListener('keydown', (e) => this.handleKeydown(e, 'day'));
    this.monthInput.addEventListener('keydown', (e) => this.handleKeydown(e, 'month'));
    this.yearInput.addEventListener('keydown', (e) => this.handleKeydown(e, 'year'));

    this.dayInput.addEventListener('focus', () => this.handleFocus('day'));
    this.monthInput.addEventListener('focus', () => this.handleFocus('month'));
    this.yearInput.addEventListener('focus', () => this.handleFocus('year'));

    this.dayInput.addEventListener('blur', () => this.handleBlur('day'));
    this.monthInput.addEventListener('blur', () => this.handleBlur('month'));
    this.yearInput.addEventListener('blur', () => this.handleBlur('year'));

    this.clearValues();
  }

  handleFocus(field) {
    this.isFocused = true;

    const input = this.getInputByField(field);
    if (input) {
      input.placeholder = '';
      input.value = '';
    }

    this.prevDayValue = this.dayInput.value;
    this.prevMonthValue = this.monthInput.value;
    this.prevYearValue = this.yearInput.value;
  }

  handleBlur(field) {
    this.isFocused = false;

    const input = this.getInputByField(field);
    if (input) {
      if (!input.value || input.value === '') {
        if (field === 'day') {
          input.placeholder = '00';
        } else if (field === 'month') {
          input.placeholder = '00';
        } else if (field === 'year') {
          input.placeholder = '0000';
        }
        input.value = '';
      } else if (field === 'year' && this.validYears.length > 0) {
        const yearNum = parseInt(input.value);
        if (isNaN(yearNum) || !this.validYears.includes(yearNum)) {
          input.value = '';
          input.placeholder = '0000';
        }
      } else if (field === 'day' && input.value.length === 1) {
        const dayNum = parseInt(input.value);
        if (dayNum >= 1 && dayNum <= 9) {
          input.value = '0' + input.value;
        }
      } else if (field === 'month' && input.value.length === 1) {
        const monthNum = parseInt(input.value);
        if (monthNum >= 1 && monthNum <= 9) {
          input.value = '0' + input.value;
        }
      }
    }

    setTimeout(() => {
      if (!this.isAutoSwitching) {
        this.validateAndUpdate(true);
      }
    }, 200);
  }

  getInputByField(field) {
    switch (field) {
      case 'day': return this.dayInput;
      case 'month': return this.monthInput;
      case 'year': return this.yearInput;
      default: return null;
    }
  }

  handleDayInput(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value === '') {
      e.target.value = '';
      return;
    }

    if (value.length > 2) value = value.slice(0, 2);

    if (value.length === 2) {
      let dayNum = parseInt(value);
      if (dayNum < 1) value = '01';
      if (dayNum > 31) value = '31';
      e.target.value = value;

      this.isAutoSwitching = true;
      setTimeout(() => {
        this.monthInput.focus();
        setTimeout(() => {
          this.isAutoSwitching = false;
        }, 100);
      }, 0);
    } else if (value.length === 1) {
      let dayNum = parseInt(value);
      if (dayNum === 0 || dayNum > 3) {
        value = '0' + value;
        e.target.value = value;

        this.isAutoSwitching = true;
        setTimeout(() => {
          this.monthInput.focus();
          setTimeout(() => {
            this.isAutoSwitching = false;
          }, 100);
        }, 0);
      } else {
        e.target.value = value;
      }
    } else {
      e.target.value = value;
    }
  }

  handleMonthInput(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value === '') {
      e.target.value = '';
      return;
    }

    if (value.length > 2) value = value.slice(0, 2);

    if (value.length === 2) {
      let monthNum = parseInt(value);
      if (monthNum < 1) {
        value = '01';
      } else if (monthNum > 12) {
        value = '12';
      } else {
        value = String(monthNum).padStart(2, '0');
      }
      e.target.value = value;

      this.isAutoSwitching = true;
      setTimeout(() => {
        this.yearInput.focus();
        setTimeout(() => {
          this.isAutoSwitching = false;
        }, 100);
      }, 0);
    } else if (value.length === 1) {
      let monthNum = parseInt(value);
      if (monthNum === 0 || monthNum > 1) {
        value = '0' + value;
        e.target.value = value;

        this.isAutoSwitching = true;
        setTimeout(() => {
          this.yearInput.focus();
          setTimeout(() => {
            this.isAutoSwitching = false;
          }, 100);
        }, 0);
      } else {
        e.target.value = value;
      }
    } else {
      e.target.value = value;
    }
  }

  handleYearInput(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value === '') {
      e.target.value = '';
      return;
    }

    if (value.length > 4) value = value.slice(0, 4);

    if (this.validYears.length > 0) {
      if (value.length === 1) {
        const hasMatchingYear = this.validYears.some(year => year.toString().startsWith(value));
        if (!hasMatchingYear) {
          e.target.value = '';
          return;
        }
      } else if (value.length === 2) {
        const hasMatchingYear = this.validYears.some(year => year.toString().startsWith(value));
        if (!hasMatchingYear) {
          e.target.value = '';
          return;
        }
      } else if (value.length === 3) {
        const hasMatchingYear = this.validYears.some(year => year.toString().startsWith(value));
        if (!hasMatchingYear) {
          e.target.value = '';
          return;
        }
      } else if (value.length === 4) {
        const yearNum = parseInt(value);
        if (!this.validYears.includes(yearNum)) {
          e.target.value = value.slice(0, 3);
          return;
        }
      }
    }

    e.target.value = value;
  }

  handleKeydown(e, field) {
    if (e.key === 'ArrowRight' || e.key === '.' || e.key === '/' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      if (field === 'day') {
        if (this.dayInput.value.length === 1) {
          const dayNum = parseInt(this.dayInput.value);
          if (dayNum >= 1 && dayNum <= 9) {
            this.dayInput.value = '0' + this.dayInput.value;
          }
        }
        this.isAutoSwitching = true;
        this.monthInput.focus();
        setTimeout(() => {
          this.isAutoSwitching = false;
        }, 100);
      } else if (field === 'month') {
        if (this.monthInput.value.length === 1) {
          const monthNum = parseInt(this.monthInput.value);
          if (monthNum >= 1 && monthNum <= 9) {
            this.monthInput.value = '0' + this.monthInput.value;
          }
        }
        this.isAutoSwitching = true;
        this.yearInput.focus();
        setTimeout(() => {
          this.isAutoSwitching = false;
        }, 100);
      }
      return;
    }

    if (e.key === 'ArrowLeft') {
      if (field === 'month') {
        e.preventDefault();
        this.dayInput.focus();
      } else if (field === 'year') {
        e.preventDefault();
        this.monthInput.focus();
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.incrementField(field, 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.incrementField(field, -1);
    } else if (e.key === 'Backspace' && e.target.value === '') {
      if (field === 'month') {
        this.dayInput.focus();
      } else if (field === 'year') {
        this.monthInput.focus();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      this.validateAndUpdate(true);
      const calendar = this.calendar;
      if (calendar && calendar.classList.contains('active')) {
        const applyBtn = calendar.querySelector('.calendar-apply');
        if (applyBtn) applyBtn.click();
      }
    }
  }

  incrementField(field, delta) {
    let value;
    let min, max;

    switch (field) {
      case 'day':
        value = parseInt(this.dayInput.value) || 1;
        min = 1;
        max = this.getDaysInMonth();
        break;
      case 'month':
        value = parseInt(this.monthInput.value) || 1;
        min = 1;
        max = 12;
        break;
      case 'year':
        value = parseInt(this.yearInput.value) || (this.validYears[0] || new Date().getFullYear());
        if (this.validYears.length > 0) {
          min = this.validYears[0];
          max = this.validYears[this.validYears.length - 1];
        } else {
          const currentYear = new Date().getFullYear();
          min = 1900;
          max = currentYear + 10;
        }
        break;
    }

    let newValue = value + delta;
    if (newValue < min) newValue = max;
    if (newValue > max) newValue = min;

    const paddedValue = field === 'year' ? String(newValue) : String(newValue).padStart(2, '0');

    switch (field) {
      case 'day':
        this.dayInput.value = paddedValue;
        break;
      case 'month':
        this.monthInput.value = paddedValue;
        break;
      case 'year':
        this.yearInput.value = paddedValue;
        break;
    }

    this.validateAndUpdate(true);
  }

  getDaysInMonth() {
    const month = parseInt(this.monthInput.value) || 1;
    const year = parseInt(this.yearInput.value) || (this.validYears[0] || new Date().getFullYear());
    return new Date(year, month, 0).getDate();
  }

  validateAndUpdate(updateCalendar = false) {
    let day = this.dayInput.value;
    let month = this.monthInput.value;
    let year = this.yearInput.value;

    if (month && month.length === 2) {
      let monthNum = parseInt(month);
      if (monthNum < 1) month = '01';
      if (monthNum > 12) month = '12';
      if (month !== this.monthInput.value) {
        this.monthInput.value = month;
      }
    }

    if (year && year.length === 4 && this.validYears.length > 0) {
      const yearNum = parseInt(year);
      if (!this.validYears.includes(yearNum)) {
        this.yearInput.value = '';
        return;
      }
    }

    if (updateCalendar && day && day.length === 2 && month && month.length === 2 && year && year.length === 4) {
      const dayNum = parseInt(day);
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);

      if (monthNum >= 1 && monthNum <= 12) {
        const maxDays = new Date(yearNum, monthNum, 0).getDate();

        if (dayNum > maxDays) {
          day = String(maxDays).padStart(2, '0');
          this.dayInput.value = day;
        }

        if (dayNum < 1) {
          day = '01';
          this.dayInput.value = day;
        }
      }

      if (dayNum >= 1 && dayNum <= maxDays) {
        const date = new Date(yearNum, monthNum - 1, dayNum);
        if (!isNaN(date.getTime()) &&
          date.getDate() === dayNum &&
          date.getMonth() + 1 === monthNum &&
          date.getFullYear() === yearNum) {
          this.updateCalendar(date);
        }
      }
    }
  }

  updateCalendar(date) {
    if (this.calendar && this.calendar.updateSelectionFromInput) {
      this.calendar.updateSelectionFromInput(date.getTime());
    }
  }

  getValue() {
    const day = this.dayInput.value;
    const month = this.monthInput.value;
    const year = this.yearInput.value;

    if (day && month && year && day.length === 2 && month.length === 2 && year.length === 4) {
      return day + ' / ' + month + ' / ' + year;
    }
    return '';
  }

  setValue(day, month, year) {
    this.dayInput.value = day;
    this.monthInput.value = month;
    this.yearInput.value = year;
    this.dayInput.placeholder = '';
    this.monthInput.placeholder = '';
    this.yearInput.placeholder = '';
  }

  clearValues() {
    this.dayInput.value = '';
    this.monthInput.value = '';
    this.yearInput.value = '';
    this.dayInput.placeholder = '00';
    this.monthInput.placeholder = '00';
    this.yearInput.placeholder = '0000';
  }
}

/** Календари .calendar */
class Calendars {
  static init() {
    var calendars = document.querySelectorAll(".calendar");
    if (calendars.length > 0) {

      var closeAllCalendarStates = function () {
        calendars.forEach(function (calendar) {
          calendar.classList.remove('active');
          calendar.classList.remove('calendar-month-active');
          calendar.classList.remove('calendar-data-active');
        });
        document.documentElement.classList.remove('open-calendar');
      };

      calendars.forEach(function (calendar, calendarIndex) {
        var calendarMain = calendar.querySelector(".calendar__main");
        var calHeaderTitle = calendar.querySelector(".calendar__header span");

        var calendarValueBlock = calendar.querySelector(".calendar__value");

        var dayInput = calendar.querySelector('.day-input');
        var monthInput = calendar.querySelector('.month-input');
        var yearInput = calendar.querySelector('.year-input');
        var calendarInput = calendar.querySelector(".input-calendar");

        var isSingleSelect = calendar.classList.contains('calendar-one');

        var monthItems = calendar.querySelectorAll('.calendar-month .calendar-header__dropdown .calendar-header__item');
        var monthsList = [];
        monthItems.forEach(function (item) {
          var monthSpan = item.querySelector('span');
          if (monthSpan) {
            monthsList.push(monthSpan.textContent.trim());
          }
        });

        var yearItems = calendar.querySelectorAll('.calendar-data .calendar-header__dropdown .calendar-header__item');
        var yearsList = [];
        yearItems.forEach(function (item) {
          var yearSpan = item.querySelector('span');
          if (yearSpan) {
            yearsList.push(parseInt(yearSpan.textContent.trim()));
          }
        });
        yearsList.sort(function (a, b) { return a - b; });

        var getShortMonth = function (fullMonthName) {
          return fullMonthName.substring(0, 3);
        };

        var getMonthNumber = function (monthName) {
          var monthMap = {
            'Январь': '01', 'Февраль': '02', 'Март': '03', 'Апрель': '04',
            'Май': '05', 'Июнь': '06', 'Июль': '07', 'Август': '08',
            'Сентябрь': '09', 'Октябрь': '10', 'Ноябрь': '11', 'Декабрь': '12'
          };
          return monthMap[monthName] || '01';
        };

        var getMonthNameFromNumber = function (monthNumber) {
          var months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
          return months[monthNumber] || 'Январь';
        };

        var todayTimestamp = Date.now() - (Date.now() % (24 * 60 * 60 * 1000));
        var today = new Date();
        var todayDay = String(today.getDate()).padStart(2, '0');
        var todayMonth = String(today.getMonth() + 1).padStart(2, '0');
        var todayYear = today.getFullYear();

        var getDateObjectFromTimestamp = function (timestamp) {
          var dateObject = new Date(timestamp);
          return {
            year: dateObject.getUTCFullYear(),
            month: String(dateObject.getUTCMonth() + 1).padStart(2, '0'),
            day: String(dateObject.getUTCDate()).padStart(2, '0')
          };
        };

        var selectedStartDate = null;
        var selectedEndDate = null;
        var tempStartDate = null;
        var tempEndDate = null;
        var isSelectingRange = false;
        var hasUserSelected = false;

        var savedDay = '';
        var savedMonth = '';
        var savedYear = '';
        var savedMonthName = '';
        var savedIsRange = false;
        var savedEndDay = null;
        var savedEndMonth = null;
        var savedEndYear = null;

        var getNumberOfDays = function (year, month) {
          return new Date(year, month + 1, 0).getDate();
        };

        var getDayDetails = function (args) {
          var date = args.index - args.firstDay;
          var dayOfWeek = (args.index % 7 + 7) % 7;
          var prevMonth = args.month - 1;
          var nextMonth = args.month + 1;
          var prevYear = args.year;
          var nextYear = args.year;

          if (prevMonth < 0) {
            prevMonth = 11;
            prevYear--;
          }
          if (nextMonth > 11) {
            nextMonth = 0;
            nextYear++;
          }

          var prevMonthDays = getNumberOfDays(prevYear, prevMonth);
          var currentMonthDays = getNumberOfDays(args.year, args.month);

          var displayDate, displayMonth, displayYear;
          if (date < 0) {
            displayDate = prevMonthDays + date + 1;
            displayMonth = prevMonth;
            displayYear = prevYear;
          } else if (date >= currentMonthDays) {
            displayDate = date - currentMonthDays + 1;
            displayMonth = nextMonth;
            displayYear = nextYear;
          } else {
            displayDate = date + 1;
            displayMonth = args.month;
            displayYear = args.year;
          }

          var timestamp = new Date(Date.UTC(displayYear, displayMonth, displayDate)).getTime();
          return {
            date: displayDate,
            day: dayOfWeek,
            month: displayMonth === args.month ? 0 : displayMonth < args.month ? -1 : 1,
            timestamp: timestamp
          };
        };

        var getMonthDetails = function (year, month) {
          var firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
          firstDay = firstDay === 0 ? 6 : firstDay - 1;
          var monthArray = [];
          for (var i = 0; i < 42; i++) {
            monthArray.push(getDayDetails({
              index: i,
              firstDay: firstDay,
              year: year,
              month: month
            }));
          }
          return monthArray;
        };

        var currentMonthIndex = 0;

        var now = new Date();
        var currentMonthName = monthsList[now.getMonth()];
        if (currentMonthName) {
          currentMonthIndex = monthsList.findIndex(function (m) { return m === currentMonthName; });
          if (currentMonthIndex === -1) currentMonthIndex = 0;
        }

        var currentYear = yearsList[0] || now.getFullYear();
        if (yearsList.length > 0) {
          var closestYear = yearsList.reduce(function (prev, curr) {
            return (Math.abs(curr - now.getFullYear()) < Math.abs(prev - now.getFullYear()) ? curr : prev);
          });
          currentYear = closestYear;
        }

        var year = currentYear;
        var month = currentMonthIndex;
        var monthDetails = getMonthDetails(year, month);

        var isDateInRange = function (timestamp, start, end) {
          if (isSingleSelect) {
            return timestamp === start;
          }
          if (!start) return false;
          if (end) {
            return timestamp >= start && timestamp <= end;
          }
          return timestamp === start;
        };

        var setCalBody = function (monthDetails, startDate, endDate) {
          if (!calendarMain) return;

          calendarMain.innerHTML = "";
          monthDetails.forEach(function (day) {
            var div = document.createElement("div");
            var span = document.createElement("span");

            div.classList.add("cell_wrapper");
            div.classList.add("cal_date");

            if (day.month === 0) {
              div.classList.add("current");
            } else if (day.month === -1) {
              div.classList.add("prev-month");
              div.classList.add("other-month");
            } else if (day.month === 1) {
              div.classList.add("next-month");
              div.classList.add("other-month");
            }

            if (day.timestamp === todayTimestamp && day.month === 0) {
              div.classList.add("isCurrent");
            }

            if (isDateInRange(day.timestamp, startDate, endDate)) {
              div.classList.add("in-range");

              if (!isSingleSelect && startDate && endDate && day.timestamp === startDate) {
                div.classList.add("range-start");
              }
              if (!isSingleSelect && endDate && day.timestamp === endDate && startDate !== endDate) {
                div.classList.add("range-end");
              }
            }

            span.classList.add("cell_item");
            span.innerText = day.date;
            div.setAttribute("data-timestamp", day.timestamp);
            div.appendChild(span);
            calendarMain.appendChild(div);
          });
        };

        var updateMonthSpan = function () {
          var monthSpan = calendar.querySelector('.calendar-month .calendar-header__button span');
          if (monthSpan && monthsList[month]) {
            monthSpan.textContent = getShortMonth(monthsList[month]);
          }

          var yearSpan = calendar.querySelector('.calendar-data .calendar-header__button span');
          if (yearSpan) {
            yearSpan.textContent = year;
          }

          if (calHeaderTitle && monthsList[month]) {
            calHeaderTitle.innerHTML = monthsList[month] + ' ' + year;
          }
        };

        var updateActiveMonthInDropdown = function () {
          monthItems.forEach(function (item, index) {
            if (index === month) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        };

        var updateActiveYearInDropdown = function () {
          yearItems.forEach(function (item) {
            var yearSpan = item.querySelector('span');
            if (yearSpan && parseInt(yearSpan.textContent) === year) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        };

        var updateSavedValues = function (startDate, endDate) {
          if (startDate) {
            var date = getDateObjectFromTimestamp(startDate);

            savedDay = date.day;

            if (!savedMonth || savedMonth === '') {
              savedMonth = date.month;
              var monthIndex = parseInt(date.month) - 1;
              savedMonthName = monthsList[monthIndex] || monthsList[0];
            }

            if (!savedYear || savedYear === '') {
              savedYear = date.year;
            }

            if (endDate && !isSingleSelect) {
              savedIsRange = true;
              var endDateObj = getDateObjectFromTimestamp(endDate);
              savedEndDay = endDateObj.day;
              savedEndMonth = endDateObj.month;
              savedEndYear = endDateObj.year;
            } else {
              savedIsRange = false;
              savedEndDay = null;
              savedEndMonth = null;
              savedEndYear = null;
            }
          } else {
            savedDay = '';
            savedMonth = '';
            savedYear = '';
            savedMonthName = '';
            savedIsRange = false;
            savedEndDay = null;
            savedEndMonth = null;
            savedEndYear = null;
          }
        };

        var updateDisplayFromSaved = function () {
          var formattedDay = '';
          var formattedMonth = '';
          var formattedYear = '';

          if (savedDay && savedDay !== '') {
            formattedDay = String(savedDay).padStart(2, '0');
          }
          if (savedMonth && savedMonth !== '') {
            formattedMonth = String(savedMonth).padStart(2, '0');
          }
          if (savedYear && savedYear !== '') {
            formattedYear = String(savedYear);
          }

          if (dayInput && monthInput && yearInput) {
            dayInput.value = formattedDay;
            monthInput.value = formattedMonth;
            yearInput.value = formattedYear;

            dayInput.placeholder = formattedDay ? '' : '00';
            monthInput.placeholder = formattedMonth ? '' : '00';
            yearInput.placeholder = formattedYear ? '' : '0000';
          }

          if (calendarValueBlock) {
            if (formattedDay && formattedMonth && formattedYear) {
              if (savedIsRange && savedEndDay) {
                var formattedEndDay = String(savedEndDay).padStart(2, '0');
                var formattedEndMonth = String(savedEndMonth).padStart(2, '0');
                calendarValueBlock.innerHTML = formattedDay + ' <span>/</span> ' + formattedMonth + ' <span>/</span> ' + formattedYear + ' - ' + formattedEndDay + ' <span>/</span> ' + formattedEndMonth + ' <span>/</span> ' + savedEndYear;
              } else {
                calendarValueBlock.innerHTML = formattedDay + ' <span>/</span> ' + formattedMonth + ' <span>/</span> ' + formattedYear;
              }
              calendarValueBlock.setAttribute('data-day', formattedDay);
              calendarValueBlock.setAttribute('data-month', formattedMonth);
              calendarValueBlock.setAttribute('data-year', formattedYear);
              calendarValueBlock.setAttribute('data-month-name', savedMonthName);
            } else if (formattedMonth && formattedYear) {
              calendarValueBlock.innerHTML = '__ / ' + formattedMonth + ' / ' + formattedYear;
            } else if (formattedYear) {
              calendarValueBlock.innerHTML = '__ / __ / ' + formattedYear;
            } else {
              calendarValueBlock.innerHTML = '';
            }
          }

          if (calendarInput) {
            if (formattedDay && formattedMonth && formattedYear) {
              calendarInput.value = formattedDay + ' / ' + formattedMonth + ' / ' + formattedYear;
              calendarInput.setAttribute('data-day', formattedDay);
              calendarInput.setAttribute('data-month', formattedMonth);
              calendarInput.setAttribute('data-year', formattedYear);
              calendarInput.setAttribute('data-month-name', savedMonthName);
            } else {
              calendarInput.value = '';
            }
          }
        };

        var updateCalendarValueDisplay = function (startDate, endDate) {
          updateSavedValues(startDate, endDate);
          updateDisplayFromSaved();
        };

        var applySelection = function () {
          selectedStartDate = tempStartDate;
          selectedEndDate = tempEndDate;
          hasUserSelected = true;

          if (selectedStartDate) {
            var startDate = new Date(selectedStartDate);
            savedDay = String(startDate.getDate()).padStart(2, '0');

            if (!savedMonth || savedMonth === '') {
              savedMonth = String(startDate.getMonth() + 1).padStart(2, '0');
              savedMonthName = getMonthNameFromNumber(startDate.getMonth());
            }

            if (!savedYear || savedYear === '') {
              savedYear = startDate.getFullYear();
            }
          }

          if (selectedEndDate && !isSingleSelect) {
            var endDate = new Date(selectedEndDate);
            savedEndDay = String(endDate.getDate()).padStart(2, '0');
            savedEndMonth = String(endDate.getMonth() + 1).padStart(2, '0');
            savedEndYear = endDate.getFullYear();
            savedIsRange = true;
          }

          updateDisplayFromSaved();
          closeCalendar();
        };

        var cancelSelection = function () {
          tempStartDate = selectedStartDate;
          tempEndDate = selectedEndDate;
          setCalBody(monthDetails, tempStartDate, tempEndDate);
          closeCalendar();
        };

        var closeCalendar = function () {
          calendar.classList.remove('active');
          calendar.classList.remove('calendar-month-active');
          calendar.classList.remove('calendar-data-active');
          document.documentElement.classList.remove('open-calendar');
        };

        var openCalendar = function () {
          tempStartDate = selectedStartDate;
          tempEndDate = selectedEndDate;
          isSelectingRange = false;

          setCalBody(monthDetails, tempStartDate, tempEndDate);
          updateCalendarValueDisplay(selectedStartDate, selectedEndDate);

          closeAllCalendarStates();
          calendar.classList.add('active');
          document.documentElement.classList.add('open-calendar');
        };

        var changeMonth = function (offset) {
          var newMonth = month + offset;
          var newYear = year;

          if (newMonth === -1) {
            newMonth = monthsList.length - 1;
            newYear--;
            if (yearsList.length > 0) {
              var currentYearIndex = yearsList.indexOf(newYear);
              if (currentYearIndex !== -1) {
                newYear = yearsList[currentYearIndex];
              } else {
                if (newYear < yearsList[0]) {
                  newYear = yearsList[yearsList.length - 1];
                } else if (newYear > yearsList[yearsList.length - 1]) {
                  newYear = yearsList[0];
                }
              }
            }
          } else if (newMonth === monthsList.length) {
            newMonth = 0;
            newYear++;
            if (yearsList.length > 0) {
              var currentYearIndex = yearsList.indexOf(newYear);
              if (currentYearIndex !== -1) {
                newYear = yearsList[currentYearIndex];
              } else {
                if (newYear < yearsList[0]) {
                  newYear = yearsList[yearsList.length - 1];
                } else if (newYear > yearsList[yearsList.length - 1]) {
                  newYear = yearsList[0];
                }
              }
            }
          }

          month = newMonth;
          year = newYear;

          monthDetails = getMonthDetails(year, month);
          updateMonthSpan();
          updateActiveMonthInDropdown();
          updateActiveYearInDropdown();
          setCalBody(monthDetails, tempStartDate, tempEndDate);

          savedMonth = getMonthNumber(monthsList[month]);
          savedMonthName = monthsList[month];
          savedYear = year.toString();
          updateDisplayFromSaved();
        };

        var changeYear = function (offset) {
          if (yearsList.length === 0) return;

          var currentIndex = yearsList.indexOf(year);

          if (currentIndex !== -1) {
            var newIndex = currentIndex + offset;

            if (newIndex < 0) {
              newIndex = yearsList.length - 1;
            } else if (newIndex >= yearsList.length) {
              newIndex = 0;
            }

            year = yearsList[newIndex];
          } else {
            if (offset === -1) {
              year = yearsList[yearsList.length - 1];
            } else {
              year = yearsList[0];
            }
          }

          monthDetails = getMonthDetails(year, month);
          updateMonthSpan();
          updateActiveYearInDropdown();
          setCalBody(monthDetails, tempStartDate, tempEndDate);

          savedYear = year.toString();
          if (!savedMonth || savedMonth === '') {
            savedMonth = getMonthNumber(monthsList[month]);
            savedMonthName = monthsList[month];
          }
          updateDisplayFromSaved();
        };

        var updateSelectionFromInput = function (timestamp) {
          var date = new Date(timestamp);
          var day = String(date.getDate()).padStart(2, '0');
          var month = String(date.getMonth() + 1).padStart(2, '0');
          var year = date.getFullYear();

          selectedStartDate = timestamp;
          selectedEndDate = null;
          tempStartDate = timestamp;
          tempEndDate = null;

          savedDay = day;

          if (!savedMonth || savedMonth === '') {
            savedMonth = month;
            savedMonthName = getMonthNameFromNumber(date.getMonth());
          }

          if (!savedYear || savedYear === '') {
            savedYear = year;
          }

          updateCalendarValueDisplay(selectedStartDate, selectedEndDate);
          setCalBody(monthDetails, tempStartDate, tempEndDate);

          var selectedMonth = date.getMonth();
          var selectedYear = date.getFullYear();

          if (selectedYear !== year || selectedMonth !== month) {
            year = selectedYear;
            month = selectedMonth;
            monthDetails = getMonthDetails(year, month);
            updateMonthSpan();
            updateActiveMonthInDropdown();
            updateActiveYearInDropdown();
            setCalBody(monthDetails, tempStartDate, tempEndDate);
          }
        };

        calendar.updateSelectionFromInput = updateSelectionFromInput;

        updateMonthSpan();
        updateActiveMonthInDropdown();
        updateActiveYearInDropdown();
        setCalBody(monthDetails, tempStartDate, tempEndDate);

        updateSavedValues(selectedStartDate, selectedEndDate);
        updateDisplayFromSaved();

        var monthPrevBtn = calendar.querySelector('.calendar-month .calendar-header__btn-prev');
        var monthNextBtn = calendar.querySelector('.calendar-month .calendar-header__btn-next');

        if (monthPrevBtn) {
          monthPrevBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            changeMonth(-1);
          });
        }

        if (monthNextBtn) {
          monthNextBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            changeMonth(1);
          });
        }

        var yearPrevBtn = calendar.querySelector('.calendar-data .calendar-header__btn-prev');
        var yearNextBtn = calendar.querySelector('.calendar-data .calendar-header__btn-next');

        if (yearPrevBtn) {
          yearPrevBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            changeYear(-1);
          });
        }

        if (yearNextBtn) {
          yearNextBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            changeYear(1);
          });
        }

        if (monthItems.length > 0) {
          monthItems.forEach(function (item, index) {
            item.addEventListener('click', function (e) {
              e.stopPropagation();
              month = index;
              monthDetails = getMonthDetails(year, month);
              updateMonthSpan();
              updateActiveMonthInDropdown();
              setCalBody(monthDetails, tempStartDate, tempEndDate);
              calendar.classList.remove('calendar-month-active');

              var monthName = monthsList[month];
              savedMonth = getMonthNumber(monthName);
              savedMonthName = monthName;

              if (!savedYear || savedYear === '') {
                savedYear = year.toString();
              }

              updateDisplayFromSaved();
            });
          });
        }

        if (yearItems.length > 0) {
          yearItems.forEach(function (item) {
            item.addEventListener('click', function (e) {
              e.stopPropagation();
              var selectedYear = parseInt(item.querySelector('span').textContent);
              if (!isNaN(selectedYear) && yearsList.includes(selectedYear)) {
                year = selectedYear;
                monthDetails = getMonthDetails(year, month);
                updateMonthSpan();
                updateActiveYearInDropdown();
                setCalBody(monthDetails, tempStartDate, tempEndDate);
                calendar.classList.remove('calendar-data-active');

                savedYear = year.toString();

                if (!savedMonth || savedMonth === '') {
                  var monthName = monthsList[month];
                  savedMonth = getMonthNumber(monthName);
                  savedMonthName = monthName;
                }

                updateDisplayFromSaved();
              }
            });
          });
        }

        var calendarMonthBlock = calendar.querySelector('.calendar-month');
        if (calendarMonthBlock) {
          var monthSpan = calendarMonthBlock.querySelector('.calendar-header__button span');
          if (monthSpan) {
            monthSpan.addEventListener('click', function (e) {
              e.stopPropagation();

              calendars.forEach(function (otherCalendar) {
                if (otherCalendar !== calendar) {
                  otherCalendar.classList.remove('calendar-month-active');
                  otherCalendar.classList.remove('calendar-data-active');
                }
              });

              calendar.classList.remove('calendar-data-active');
              calendar.classList.toggle('calendar-month-active');
            });
          }
        }

        var calendarDataBlock = calendar.querySelector('.calendar-data');
        if (calendarDataBlock) {
          var yearSpan = calendarDataBlock.querySelector('.calendar-header__button span');
          if (yearSpan) {
            yearSpan.addEventListener('click', function (e) {
              e.stopPropagation();

              calendars.forEach(function (otherCalendar) {
                if (otherCalendar !== calendar) {
                  otherCalendar.classList.remove('calendar-month-active');
                  otherCalendar.classList.remove('calendar-data-active');
                }
              });

              calendar.classList.remove('calendar-month-active');
              calendar.classList.toggle('calendar-data-active');
            });
          }
        }

        if (calendarMain) {
          calendarMain.addEventListener("click", function (e) {
            e.stopPropagation();

            var target = e.target.closest(".cell_wrapper");

            if (!target) {
              return;
            }

            var cellTimestamp = parseInt(target.getAttribute("data-timestamp"));
            if (!cellTimestamp) {
              return;
            }

            var selectedDate = new Date(cellTimestamp);
            var clickedDay = String(selectedDate.getDate()).padStart(2, '0');
            var clickedMonth = String(selectedDate.getMonth() + 1).padStart(2, '0');
            var clickedYear = selectedDate.getFullYear();

            savedDay = clickedDay;

            if (!savedMonth || savedMonth === '') {
              savedMonth = clickedMonth;
              savedMonthName = getMonthNameFromNumber(selectedDate.getMonth());
            }

            if (!savedYear || savedYear === '') {
              savedYear = clickedYear;
            }

            if (isSingleSelect) {
              if (tempStartDate === cellTimestamp) {
                return;
              }
              tempStartDate = cellTimestamp;
              tempEndDate = null;
              updateDisplayFromSaved();
              setCalBody(monthDetails, tempStartDate, tempEndDate);
            } else {
              if (tempStartDate === null) {
                tempStartDate = cellTimestamp;
                tempEndDate = null;
                isSelectingRange = true;
                updateDisplayFromSaved();
              } else if (tempStartDate !== null && tempEndDate === null) {
                if (cellTimestamp < tempStartDate) {
                  tempEndDate = tempStartDate;
                  tempStartDate = cellTimestamp;
                } else if (cellTimestamp > tempStartDate) {
                  tempEndDate = cellTimestamp;
                } else {
                  tempEndDate = null;
                  isSelectingRange = false;
                  updateDisplayFromSaved();
                  setCalBody(monthDetails, tempStartDate, tempEndDate);
                  return;
                }
                isSelectingRange = false;

                if (tempEndDate) {
                  var endDate = new Date(tempEndDate);
                  savedEndDay = String(endDate.getDate()).padStart(2, '0');
                  savedEndMonth = String(endDate.getMonth() + 1).padStart(2, '0');
                  savedEndYear = endDate.getFullYear();
                }

                updateDisplayFromSaved();
              } else {
                tempStartDate = cellTimestamp;
                tempEndDate = null;
                isSelectingRange = true;

                savedEndDay = null;
                savedEndMonth = null;
                savedEndYear = null;
                savedIsRange = false;

                updateDisplayFromSaved();
              }
              setCalBody(monthDetails, tempStartDate, tempEndDate);
            }
          });
        }

        var clearBtn = calendar.querySelector('.calendar-clear');
        if (clearBtn) {
          clearBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            selectedStartDate = null;
            selectedEndDate = null;
            tempStartDate = null;
            tempEndDate = null;
            isSelectingRange = false;
            hasUserSelected = false;

            savedDay = '';
            savedMonth = '';
            savedYear = '';
            savedMonthName = '';
            savedIsRange = false;
            savedEndDay = null;
            savedEndMonth = null;
            savedEndYear = null;

            updateCalendarValueDisplay(tempStartDate, tempEndDate);
            setCalBody(monthDetails, tempStartDate, tempEndDate);

            if (dateSectionInput) {
              dateSectionInput.clearValues();
            }
          });
        }

        var closeBtn = calendar.querySelector('.calendar-close');
        if (closeBtn) {
          closeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            cancelSelection();
          });
        }

        var applyBtn = calendar.querySelector('.calendar-apply');
        if (applyBtn) {
          applyBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            if (tempStartDate !== selectedStartDate || tempEndDate !== selectedEndDate) {
              applySelection();
            } else {
              closeCalendar();
            }
          });
        }

        var calendarIcon = calendar.querySelector('.calendar__icon');
        if (calendarIcon) {
          calendarIcon.addEventListener('click', function (e) {
            e.stopPropagation();
            if (calendar.classList.contains('active')) {
              closeCalendar();
            } else {
              openCalendar();
            }
          });
        }

        var dateSectionInput = null;
        if (dayInput && monthInput && yearInput) {
          dateSectionInput = new DateSectionInput(calendar, dayInput, monthInput, yearInput);
        }

        if (calendarInput) {
          calendarInput.addEventListener('click', function (e) {
            e.stopPropagation();
            if (calendar.classList.contains('active')) {
              closeCalendar();
            } else {
              openCalendar();
            }
          });
        }

        updateCalendarValueDisplay(selectedStartDate, selectedEndDate);
      });

      document.addEventListener('click', function (e) {
        if (!e.target.closest('.calendar')) {
          closeAllCalendarStates();
        }
      });
    }
  }
}

Calendars.init();
