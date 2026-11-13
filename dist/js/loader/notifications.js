/*
  Загрузчик: уведомления
 */

class LoaderNotifications {
  static OPEN_CLASS = 'loader-open-notifications';

  static init() {
    const root = document.querySelector('.header-loader .header-notifications');
    return root ? new LoaderNotifications(root) : null;
  }

  constructor(root) {
    this.root = root;
    this.html = document.documentElement;
    this.icon = root.querySelector('.header-notifications__icon');
    this.closeButtons = [
      root.querySelector('.header-notifications__close'),
      root.querySelector('.header-notifications__dropdown .btn-close'),
    ].filter(Boolean);

    this.bindEvents();
  }

  get isOpen() {
    return this.html.classList.contains(LoaderNotifications.OPEN_CLASS);
  }

  open() {
    this.html.classList.add(LoaderNotifications.OPEN_CLASS);
  }

  close() {
    this.html.classList.remove(LoaderNotifications.OPEN_CLASS);
  }

  toggle() {
    this.html.classList.toggle(LoaderNotifications.OPEN_CLASS);
  }

  bindEvents() {
    this.icon?.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.toggle();
    });

    this.closeButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.close();
      });
    });

    document.addEventListener('click', (e) => {
      if (!this.root.contains(e.target)) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') this.close();
    });

    window.addEventListener('resize', () => this.close());
  }
}

LoaderNotifications.init();
