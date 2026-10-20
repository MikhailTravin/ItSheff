// Страница «Загрузчик»: переключение экранов, вкладок, модалок, опроса. Подключить: <script src="js/loader.js"></script>
(() => {
    const root = document.querySelector("[data-loader]");
    if (!root) return;
    const $ = (s, c = root) => c.querySelector(s);
    const $$ = (s, c = root) => [...c.querySelectorAll(s)];
    let prev = "app";
    let timer;

    const go = (name) => {
        if (name === "back") name = prev;
        if (root.dataset.current !== "notifications" && root.dataset.current !== "survey") prev = root.dataset.current;
        $$("[data-screen]").forEach((s) => s.classList.toggle("is-active", s.dataset.screen === name));
        root.dataset.current = name;
    };
    const toggle = (name, on) => $(`[data-modal="${name}"]`)?.classList.toggle("is-open", on);
    const toast = (html) => {
        const t = $("[data-toast]");
        t.innerHTML = html;
        t.classList.add("is-show");
        clearTimeout(timer);
        timer = setTimeout(() => t.classList.remove("is-show"), 2500);
    };
    const tab = (name) => {
        $$("[data-tab]").forEach((b) => b.classList.toggle("is-active", b.matches(".loader-tabs button") && b.dataset.tab === name));
        $$("[data-panel]").forEach((p) => p.classList.toggle("is-active", p.dataset.panel === name));
    };

    // ----- вход -----
    const form = $("[data-login]");
    const pass = $("[data-password]");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const login = $("[data-select-value]");
        if (login.classList.contains("is-placeholder") || !pass.value) return form.classList.add("is-error");
        form.classList.remove("is-error");
        go("progress");
        const bar = $("[data-bar]"), num = $("[data-percent]"), box = $(".loader-progress"), text = $("[data-progress-text]");
        box.classList.remove("is-indeterminate");
        text.textContent = "Загрузка файла";
        let p = 0;
        const iv = setInterval(() => {
            p += 8;
            bar.style.width = Math.min(p, 100) + "%";
            num.textContent = Math.min(p, 100) + "%";
            if (p >= 100) {
                clearInterval(iv);
                box.classList.add("is-indeterminate");
                text.textContent = "Подготовка к запуску";
                setTimeout(() => go("app"), 1500);
            }
        }, 180);
    });
    pass.addEventListener("input", () => form.classList.remove("is-error"));

    // ----- общие клики -----
    root.addEventListener("click", (e) => {
        const t = e.target;
        const sel = t.closest("[data-select]");
        if (!sel) $$("[data-select]").forEach((s) => s.classList.remove("is-open"));

        if (t.closest("[data-select-btn]")) sel.classList.toggle("is-open");
        const li = t.closest("[data-select] li");
        if (li) {
            const v = $("[data-select-value]");
            v.textContent = li.dataset.value;
            v.classList.remove("is-placeholder");
            $$("[data-select] li").forEach((x) => x.classList.toggle("is-active", x === li));
            sel.classList.remove("is-open");
            form.classList.remove("is-error");
        }
        if (t.closest("[data-eye]")) pass.type = pass.type === "password" ? "text" : "password";

        const tb = t.closest("[data-tab]");
        if (tb) tab(tb.dataset.tab);
        const g = t.closest("[data-go]");
        if (g) go(g.dataset.go);
        const o = t.closest("[data-open]");
        if (o) toggle(o.dataset.open, true);
        if (t.closest("[data-close]")) t.closest(".loader-modal").classList.remove("is-open");

        // базы данных
        const db = t.closest("[data-db-list] li");
        if (db) {
            $$("[data-db-list] li").forEach((x) => x.classList.toggle("is-active", x === db));
            $$("[data-db-btn]").forEach((b) => (b.disabled = false));
        }
        // поддержка: подвкладки
        const st = t.closest(".loader-subtabs button");
        if (st) $$(".loader-subtabs button").forEach((b) => b.classList.toggle("is-active", b === st));
        // сеансы
        const kick = t.closest("[data-kick]");
        if (kick) {
            const row = kick.closest("li");
            row.classList.add("is-gone");
            toast(`Выбит - <b>${row.querySelector("p").textContent.split(" - ").pop()}</b>`);
        }
        if (t.closest("[data-kick-all]")) {
            $$(".loader-users li").forEach((r) => r.classList.add("is-gone"));
            toast("Выбиты все пользователи - <b>4</b>");
        }
        const n = t.closest("[data-num]");
        if (n) {
            const val = $("[data-num-val]");
            val.textContent = Math.max(1, +val.textContent + +n.dataset.num);
        }
    });

    // ----- поиск по базам -----
    $("[data-db-search]").addEventListener("input", (e) => {
        const q = e.target.value.trim().toLowerCase();
        $$("[data-db-list] li").forEach((li) => (li.hidden = !li.textContent.toLowerCase().includes(q)));
    });

    // ----- опрос -----
    let step = 1;
    const steps = $$("[data-step]");
    const showStep = (n) => {
        step = Math.min(Math.max(n, 1), steps.length);
        steps.forEach((s) => s.classList.toggle("is-active", +s.dataset.step === step));
        $("[data-step-prev]").textContent = step === 1 ? "Закрыть" : "Назад";
        $("[data-step-next]").textContent = step === steps.length ? "Завершить" : "Далее";
    };
    $("[data-step-next]").addEventListener("click", () => {
        if (step === steps.length) {
            go("app");
            showStep(1);
            toast("Опрос успешно завершен");
        } else showStep(step + 1);
    });
    $("[data-step-prev]").addEventListener("click", () => (step === 1 ? go("app") : showStep(step - 1)));

    const labels = ["Очень плохо", "Плохо", "Скорее плохо", "Ниже среднего", "Нейтрально, без ярких плюсов и минусов", "Выше среднего", "Скорее хорошо", "Хорошо", "Очень хорошо", "Отлично, обязательно порекомендую"];
    const rate = $("[data-rate]");
    rate.addEventListener("input", () => {
        $("[data-rate-num]").textContent = rate.value;
        $("[data-rate-text]").textContent = labels[rate.value - 1];
        rate.style.setProperty("--p", ((rate.value - 1) / 9) * 100 + "%");
    });
})();

//========================================================================================================================================================

/*Уведомления*/
const loaderNotifications = document.querySelector('.header-loader .header-notifications');

if (loaderNotifications) {
    const documentElement = document.documentElement;
    const OPEN_CLASS = 'loader-open-notifications';

    const notificationIcon = loaderNotifications.querySelector('.header-notifications__icon');
    const notificationClose = loaderNotifications.querySelector('.header-notifications__close');
    const notificationBtnClose = loaderNotifications.querySelector('.header-notifications__dropdown .btn-close');

    function closeNotifications() {
        documentElement.classList.remove(OPEN_CLASS);
    }

    function toggleNotifications() {
        documentElement.classList.toggle(OPEN_CLASS);
    }

    function handleIconClick(event) {
        event.stopPropagation();
        event.preventDefault();
        toggleNotifications();
    }

    function handleCloseClick(event) {
        event.stopPropagation();
        event.preventDefault();
        closeNotifications();
    }

    function handleClickOutside(event) {
        if (!loaderNotifications.contains(event.target)) {
            closeNotifications();
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Escape' || event.key === 'Esc') {
            closeNotifications();
        }
    }

    notificationIcon.addEventListener('click', handleIconClick);

    if (notificationClose) {
        notificationClose.addEventListener('click', handleCloseClick);
    }

    if (notificationBtnClose) {
        notificationBtnClose.addEventListener('click', handleCloseClick);
    }

    document.addEventListener('click', handleClickOutside);

    document.addEventListener('keydown', handleKeyDown);

    window.addEventListener('resize', closeNotifications);
}