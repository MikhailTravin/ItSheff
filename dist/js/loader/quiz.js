/*
  Загрузчик: опрос
 */

class LoaderQuiz {
  static init() {
    const quiz = document.querySelector(".loader-quiz");
    if (!quiz) return;

    const root = document.documentElement;
    const OPEN_CLASS = "loader-open-quiz";
    const NOTIFICATIONS_CLASS = "loader-open-notifications";

    const SENT_SELECTOR = "#btn-sent4";
    const SENT_OPEN_CLASS = "btn-sent-open";
    const SENT_DURATION = 2500;
    const SENT_DELAY = 500;

    // Шкала
    const DEFAULT_SCORE = 5;
    const SCORE_MIN = -5;
    const SCORE_MAX = 5;

    // Порядок шагов в зависимости от оценки
    const PATHS = {
      high: ["score", "reason", "advantage", "interview", "contact"], // 4…5
      mid: ["score", "reason", "advantage", "improve-mid", "contact"], // 2…3
      low: ["score", "reason", "advantage", "improve-low", "contact"], // −5…1
    };

    // Подписи под числом (ключ = оценка)
    const SCORE_LABELS = {
      "-5": "Ни при каких условиях не порекомендую, крайне негативный опыт",
      "-4": "Точно не порекомендую, остался сильно недоволен",
      "-3": "Скорее не порекомендую, много проблем и разочарования",
      "-2": "Впечатление ниже среднего, не вижу причин рекомендовать",
      "-1": "Скорее не порекомендую, есть заметные недостатки",
      "0": "Нейтрально, без ярких плюсов и минусов",
      "1": "Скорее порекомендую, но без особого энтузиазма",
      "2": "В целом хороший опыт, могу рекомендовать",
      "3": "Уверенно рекомендую, остался доволен",
      "4": "Очень высокий уровень, с радостью рекомендую",
      "5": "Обязательно рекомендую, отличный опыт, лучший выбор",
    };

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

    const state = { current: "score", score: DEFAULT_SCORE, touched: false };

    let slider = null;
    if (window.noUiSlider) {
      slider = noUiSlider.create(sliderEl, {
        start: DEFAULT_SCORE,
        step: 1,
        connect: [true, false],
        range: { min: SCORE_MIN, max: SCORE_MAX },
        pips: { mode: "steps", stepped: true, density: 10 },
        format: {
          to: (v) => Math.round(v),
          from: (v) => Number(v),
        },
      });
      slider.on("update", (values) => setScore(Number(values[0])));
      slider.on("change", () => {
        state.touched = true;
      });
    } else {
      console.warn("loader-quiz: noUiSlider не найден");
    }

    function formatScore(v) {
      if (v > 0) return v;
      if (v < 0) return "\u2212" + Math.abs(v);
      return "0";
    }

    function setScore(value) {
      state.score = value;
      scoreValue.textContent = formatScore(value);
      scoreLabel.textContent = SCORE_LABELS[value] || "";
    }

    function getPath() {
      if (state.score >= 4) return PATHS.high;
      if (state.score >= 2) return PATHS.mid;
      return PATHS.low;
    }

    function resetScroll(body) {
      if (!body) return;
      const sb = window.SimpleBar && SimpleBar.instances && SimpleBar.instances.get(body);
      if (sb) {
        sb.recalculate();
        sb.getScrollElement().scrollTop = 0;
      } else {
        body.scrollTop = 0;
      }
    }

    function showStep(name) {
      Object.values(steps).forEach((el) => el.classList.remove("active"));
      steps[name].classList.add("active");
      state.current = name;

      const num = steps[name].querySelector(".loader-quiz__num");
      if (num) num.textContent = getPath().indexOf(name) + 1;

      resetScroll(steps[name].querySelector(".loader-quiz__body"));
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

    let sentEl = null;
    let sentShowTimeout = null;
    let sentHideTimeout = null;
    let sentCleanupTimeout = null;
    let sentStart = 0;
    let sentRemaining = 0;

    function sentDirection(el) {
      const rect = el.getBoundingClientRect();
      return rect.top + rect.height / 2 < window.innerHeight / 2 ? "top" : "bottom";
    }

    function sentStartTimer(duration) {
      clearTimeout(sentHideTimeout);
      sentStart = Date.now();
      sentRemaining = duration;
      sentHideTimeout = setTimeout(hideSent, duration);
    }

    function sentPause() {
      if (!sentHideTimeout) return;
      clearTimeout(sentHideTimeout);
      sentHideTimeout = null;
      sentRemaining = Math.max(0, sentRemaining - (Date.now() - sentStart));
    }

    function sentResume() {
      if (!sentEl || sentRemaining <= 0) return;
      sentStartTimer(sentRemaining);
    }

    function hideSent() {
      if (!sentEl) return;
      const el = sentEl;

      clearTimeout(sentHideTimeout);
      sentHideTimeout = null;

      el.style.transition = "opacity 0.5s ease";
      el.style.opacity = "0";

      sentCleanupTimeout = setTimeout(() => {
        el.classList.remove(SENT_OPEN_CLASS);
        el.style.display = "none";
        el.style.transition = "none";
        el.style.opacity = "";
        el.style.transform = "";
        sentCleanupTimeout = null;
      }, 500);

      el.removeEventListener("mouseenter", sentPause);
      el.removeEventListener("mouseleave", sentResume);
      sentEl = null;
    }

    function showSent() {
      const el = document.querySelector(SENT_SELECTOR);
      if (!el) return;

      clearTimeout(sentShowTimeout);
      clearTimeout(sentCleanupTimeout);
      sentCleanupTimeout = null;

      sentShowTimeout = setTimeout(() => {
        sentEl = el;

        el.style.display = "flex";
        el.style.transition = "none";
        el.style.opacity = "0";
        el.style.transform = sentDirection(el) === "bottom" ? "translateY(24px)" : "translateY(-24px)";
        el.classList.add(SENT_OPEN_CLASS);
        el.offsetHeight;

        setTimeout(() => {
          el.style.transition = "opacity 0.3s ease, transform 0.3s ease";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, 10);

        el.removeEventListener("mouseenter", sentPause);
        el.removeEventListener("mouseleave", sentResume);
        el.addEventListener("mouseenter", sentPause);
        el.addEventListener("mouseleave", sentResume);

        sentStartTimer(SENT_DURATION);
      }, SENT_DELAY);
    }

    function collect(withContact) {
      const path = getPath();
      const val = (name) => {
        const el = quiz.querySelector(`[name="${name}"]`);
        return el ? el.value.trim() : "";
      };

      const data = { score: state.touched ? state.score : null };

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

      quiz.dispatchEvent(new CustomEvent("loaderQuiz:submit", { bubbles: true, detail: data }));
      console.log("loader-quiz:", data);

      closeQuiz();
      showSent();
      setTimeout(resetQuiz, 300);
    }

    function resetQuiz() {
      quiz.querySelectorAll("textarea, input").forEach((el) => {
        if (el.type === "checkbox" || el.type === "radio") el.checked = false;
        else el.value = "";
      });
      contactInput.classList.remove("_form-error");
      interviewNext.disabled = true;
      if (slider) slider.set(DEFAULT_SCORE);
      else setScore(DEFAULT_SCORE);
      state.touched = false;
      showStep("score");
    }

    document.addEventListener("click", (e) => {
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
        case "close":
          openModal();
          break;
        case "stay":
          closeModal();
          break;
        case "exit":
          closeQuiz();
          break;
        case "skip":
          finish(false);
          break;
        case "submit":
          if (!contactInput.value.trim()) {
            contactInput.classList.add("is-error");
            contactInput.focus();
            return;
          }
          finish(true);
          break;
      }
    });

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
