/*
  Загрузчик: прогресс
 */

class LoaderProgress {
  static init() {
    const block = document.querySelector(".loader-progress");
    if (!block) return;

    const percentEl = block.querySelector(".loader-progress__percent");
    const fillEl = block.querySelector(".loader-progress__fill");
    const textEl = block.querySelector(".loader-progress__text");

    function setIndeterminate(text) {
      block.classList.remove("loader-progress--determinate");
      block.classList.add("loader-progress--indeterminate");
      fillEl.style.width = "";
      if (text) textEl.textContent = text;
    }

    function setProgress(percent, text) {
      const value = Math.max(0, Math.min(100, Math.round(percent)));
      block.classList.remove("loader-progress--indeterminate");
      block.classList.add("loader-progress--determinate");
      fillEl.style.width = value + "%";
      percentEl.textContent = value + "%";
      if (text) textEl.textContent = text;
    }

    window.loaderProgress = { setIndeterminate, setProgress };

    setTimeout(() => {
      let p = 0;
      setProgress(0, "Загрузка файла");
      const timer = setInterval(() => {
        p += 4;
        setProgress(p);
        if (p >= 100) clearInterval(timer);
      }, 150);
    }, 2500);
  }
}

LoaderProgress.init();
