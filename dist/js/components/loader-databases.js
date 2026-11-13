const SEARCH_MIN = 12; // поиск показываем, если баз больше
const DRAG_MIN = 8;    // иконки drag-n-drop показываем, если баз больше

document.querySelectorAll('.block-loader-databases').forEach(block => {
    const search = block.querySelector('.search');
    const input = search.querySelector('input');
    const clearBtn = search.querySelector('.search__close');
    const buttons = block.querySelectorAll('.header-notifications-buttons .btn');
    const launchBtn = block.querySelector('.header-notifications-buttons .btn-bg');
    const getItems = () => block.querySelectorAll('.checkbox-bases');
    const getChecked = () => block.querySelector('.checkbox-bases__input:checked');

    let selectedValue = null;

    // 1. Поиск и drag-иконки в зависимости от количества баз
    function updateState() {
        const count = getItems().length;
        search.hidden = count <= SEARCH_MIN;
        block.classList.toggle('has-drag', count > DRAG_MIN);
    }

    // 2. Кнопки неактивны, пока не выбрана БД
    function updateButtons() {
        const checked = getChecked();
        const hasSelected = !!checked;
        selectedValue = hasSelected ? checked.value : null;
        buttons.forEach(btn => {
            btn.classList.toggle('disabled', !hasSelected);
            btn.setAttribute('aria-disabled', String(!hasSelected));
            btn.tabIndex = hasSelected ? 0 : -1;
        });
    }

    updateState();
    updateButtons();
    block.addEventListener('change', updateButtons);

    buttons.forEach(btn => {
        btn.addEventListener('click', e => {
            if (btn.classList.contains('disabled')) e.preventDefault();
        });
    });

    // 3. Фильтр + скрытие иконок в поисковой выдаче
    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        block.classList.toggle('is-searching', q !== '');
        getItems().forEach(item => {
            const text = item.querySelector('.checkbox-bases__text').textContent.toLowerCase();
            item.hidden = q !== '' && !text.includes(q);
        });
    });
    clearBtn.addEventListener('click', () => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
    });

    // 4. Клик по иконке не селектирует строку
    block.addEventListener('click', e => {
        if (e.target.closest('.checkbox-bases .cabinet-objects-top__picker')) {
            e.preventDefault();
        }
    });

    // 5. Деселект: клик по пустому пространству или повторный клик по выбранной строке
    block.addEventListener('click', e => {
        if (e.target.closest('.cabinet-objects-top__picker')) return;

        const label = e.target.closest('.checkbox-bases__label');

        if (label) {
            if (e.target.classList.contains('checkbox-bases__input')) return;

            const radio = label.parentElement.querySelector('.checkbox-bases__input');
            if (radio.checked) {
                e.preventDefault();
                radio.checked = false;
                updateButtons();
            }
            return;
        }

        if (e.target.closest('.checkbox-bases, .search, .header-notifications-buttons, .simplebar-track')) return;
        const checked = getChecked();
        if (!checked) return;
        checked.checked = false;
        updateButtons();
    });

    // 6. Двойной клик по строке — выбор и запуск базы
    block.addEventListener('dblclick', e => {
        if (e.target.closest('.cabinet-objects-top__picker')) return;
        const label = e.target.closest('.checkbox-bases__label');
        if (!label) return;

        label.parentElement.querySelector('.checkbox-bases__input').checked = true;
        updateButtons();
        launchBtn?.click();
    });

    new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (
                    !(node instanceof HTMLElement) ||
                    !node.classList.contains('block-cabinet__drag-clone') ||
                    !node.classList.contains('checkbox-bases')
                ) return;

                node.querySelectorAll('input').forEach(i => {
                    i.removeAttribute('name');
                    i.removeAttribute('id');
                });

                if (selectedValue !== null) {
                    const original = block.querySelector(`.checkbox-bases__input[value="${selectedValue}"]`);
                    if (original) original.checked = true;
                }
            });
        });
    }).observe(document.body, { childList: true });
});