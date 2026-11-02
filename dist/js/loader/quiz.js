/**
 * Загрузчик: опрос
 * ------------------------------------------------------------
 * Модалка опроса .loader-quiz: шаги, оценка (noUiSlider), отправка (событие loaderQuiz:submit).
 *
 * Класс:      LoaderQuiz
 * Включается: если на странице есть `.loader-quiz`
 * Зависит от: vendor/nouislider.min
 * Страницы:   loader-login-error, loader-login, loader-progress, loader
 */

class LoaderQuiz {
  static init() {
    const quiz = document.querySelector(".loader-quiz");
    if (!quiz) return;

    const root = document.documentElement;
    const OPEN_CLASS = "loader-open-quiz";
    const NOTIFICATIONS_CLASS = "loader-open-notifications";
    const DEFAULT_SCORE = 5;

    // Порядок шагов в зависимости от оценки
    const PATHS = {
      high: ["score", "reason", "advantage", "interview", "contact"], // 9–10
      mid: ["score", "reason", "improve-mid", "contact"], // 7–8
      low: ["score", "reason", "improve-low", "contact"], // 0–6
    };

    // Подписи под числом (индекс = оценка)
    const SCORE_LABELS = [
      "Точно не порекомендую",
      "Очень разочарован",
      "Много серьезных проблем",
      "Скорее не понравилось",
      "Есть заметные минусы",
      "Нейтрально, без ярких плюсов и минусов",
      "Нормально, но есть замечания",
      "В целом доволен",
      "Хорошо, но есть что улучшить",
      "Очень доволен, скорее порекомендую",
      "Обязательно порекомендую",
    ];

    const steps = {};
    quiz.querySelectorAll("[data-quiz-step]").forEach((el) => {
      steps[el.dataset.quizStep] = el;
    });

    const modal = quiz.querySelector(".loader-quiz__modal");
    const scoreValue = quiz.querySelector(".loader-quiz__score-value");
    const scoreLabel = quiz.querySelector(".loader-quiz__score-label");
    const sliderEl = quiz.querySelector(".loader-quiz__slider");
    const contactInput = quiz.querySelector('[name="quiz-contact"]');
    const interviewNext = steps["interview"].querySelector('[data-quiz-action="next"]');

    const state = { current: "score", score: DEFAULT_SCORE };

    /* ---------- Слайдер ---------- */
    let slider = null;
    if (window.noUiSlider) {
      slider = noUiSlider.create(sliderEl, {
        start: DEFAULT_SCORE,
        step: 1,
        connect: [true, false],
        range: { min: 0, max: 10 },
        pips: { mode: "steps", stepped: true, density: 10 },
        format: {
          to: (v) => Math.round(v),
          from: (v) => Number(v),
        },
      });
      slider.on("update", (values) => setScore(Number(values[0])));
    } else {
      console.warn("loader-quiz: noUiSlider не найден");
    }

    function setScore(value) {
      state.score = value;
      scoreValue.textContent = value;
      scoreLabel.textContent = SCORE_LABELS[value] || "";
    }

    /* ---------- Шаги ---------- */
    function getPath() {
      if (state.score >= 9) return PATHS.high;
      if (state.score >= 7) return PATHS.mid;
      return PATHS.low;
    }

    function showStep(name) {
      Object.values(steps).forEach((el) => el.classList.remove("active"));
      steps[name].classList.add("active");
      state.current = name;

      // номер вопроса по порядку в текущей ветке
      const num = steps[name].querySelector(".loader-quiz__num");
      if (num) num.textContent = getPath().indexOf(name) + 1;

      const body = steps[name].querySelector(".loader-quiz__body");
      if (body) body.scrollTop = 0;
    }

    function next() {
      const path = getPath();
      const idx = path.indexOf(state.current);
      if (idx > -1 && idx < path.length - 1) showStep(path[idx + 1]);
    }

    function prev() {
      const path = getPath();
      const idx = path.indexOf(state.current);
      if (idx > 0) showStep(path[idx - 1]);
    }

    /* ---------- Открытие / закрытие ---------- */
    function openQuiz() {
      root.classList.remove(NOTIFICATIONS_CLASS);
      root.classList.add(OPEN_CLASS);
      quiz.setAttribute("aria-hidden", "false");
    }

    function closeQuiz() {
      root.classList.remove(OPEN_CLASS);
      quiz.setAttribute("aria-hidden", "true");
      closeModal();
    }

    function openModal() {
      modal.classList.add("is-open");
    }

    function closeModal() {
      modal.classList.remove("is-open");
    }

    /* ---------- Отправка ---------- */
    function collect(withContact) {
      const path = getPath();
      const val = (name) => {
        const el = quiz.querySelector(`[name="${name}"]`);
        return el ? el.value.trim() : "";
      };
      const data = { score: state.score };

      if (path.includes("reason")) data.reason = val("quiz-reason");
      if (path.includes("advantage")) {
        data.advantages = [...quiz.querySelectorAll('[name="quiz-advantage"]:checked')].map((i) => i.value);
      }
      if (path.includes("interview")) {
        const checked = quiz.querySelector('[name="quiz-interview"]:checked');
        data.interview = checked ? checked.value : null;
      }
      if (path.includes("improve-mid")) data.improve = val("quiz-improve-mid");
      if (path.includes("improve-low")) data.improve = val("quiz-improve-low");

      data.contact = withContact ? val("quiz-contact") : null;
      return data;
    }

    function finish(withContact) {
      const data = collect(withContact);

      // Здесь отправь данные на сервер, либо слушай событие снаружи
      quiz.dispatchEvent(new CustomEvent("loaderQuiz:submit", { bubbles: true, detail: data }));
      console.log("loader-quiz:", data);

      closeQuiz();
      setTimeout(resetQuiz, 300);
    }

    function resetQuiz() {
      quiz.querySelectorAll("textarea, input").forEach((el) => {
        if (el.type === "checkbox" || el.type === "radio") el.checked = false;
        else el.value = "";
      });
      contactInput.classList.remove("is-error");
      interviewNext.disabled = true;
      if (slider) slider.set(DEFAULT_SCORE);
      else setScore(DEFAULT_SCORE);
      showStep("score");
    }

    /* ---------- События ---------- */
    document.addEventListener("click", (e) => {
      // любые кнопки открытия (их может быть несколько)
      const opener = e.target.closest(".btn-quiz");
      if (opener) {
        e.preventDefault();
        root.classList.contains(OPEN_CLASS) ? closeQuiz() : openQuiz();
        return;
      }

      const btn = e.target.closest("[data-quiz-action]");
      if (!btn || !quiz.contains(btn)) return;

      switch (btn.dataset.quizAction) {
        case "next":
          next();
          break;
        case "prev":
          prev();
          break;
        case "close": // крестик в шапке / «Закрыть» на 1 шаге
          openModal();
          break;
        case "stay": // «Нет, продолжить»
          closeModal();
          break;
        case "exit": // «Да, выйти» — ответы остаются в форме
          closeQuiz();
          break;
        case "skip": // «Нет, спасибо»
          finish(false);
          break;
        case "submit": // «Да, пусть свяжутся»
          if (!contactInput.value.trim()) {
            contactInput.classList.add("is-error");
            contactInput.focus();
            return;
          }
          finish(true);
          break;
      }
    });

    // «Далее» на шаге интервью активна только после выбора ответа
    quiz.querySelectorAll('[name="quiz-interview"]').forEach((input) => {
      input.addEventListener("change", () => {
        interviewNext.disabled = false;
      });
    });

    contactInput.addEventListener("input", () => contactInput.classList.remove("is-error"));
    contactInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        quiz.querySelector('[data-quiz-action="submit"]').click();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || !root.classList.contains(OPEN_CLASS)) return;
      modal.classList.contains("is-open") ? closeModal() : openModal();
    });

    setScore(DEFAULT_SCORE);
  }
}

LoaderQuiz.init();
