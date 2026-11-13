document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('.search__close');
    if (!closeBtn) return;

    const input = closeBtn.closest('.search').querySelector('input');
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
});