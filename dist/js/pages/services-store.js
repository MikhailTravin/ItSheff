const iconsWrap = document.querySelector('.block-services-store__icons');

if (iconsWrap) {
    const icons = iconsWrap.querySelectorAll('.block-services-store__icon');
    const gridBtn = iconsWrap.querySelector('.grid-plates');
    const listBtn = iconsWrap.querySelector('.lists-rows');
    const mq = window.matchMedia('(max-width: 767px)');

    const setView = (isList) => {
        gridBtn.classList.toggle('active', !isList);
        listBtn.classList.toggle('active', isList);
        document.documentElement.classList.toggle('lists-rows-open', isList);
    };

    icons.forEach((icon) => {
        icon.addEventListener('click', () => {
            if (mq.matches) return;
            setView(icon.classList.contains('lists-rows'));
        });
    });

    const onChange = (e) => {
        if (e.matches) {
            setView(true);
        } else {
            setView(false);
        }
    };

    mq.addEventListener('change', onChange);

    if (mq.matches) setView(true);
}