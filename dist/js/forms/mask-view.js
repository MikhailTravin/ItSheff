/*
  Подсветка введённого номера (цифры / символы маски)
 */

class MaskView {
  static SELECTOR = 'input.tel, input.telephone, input.telephone2';

  static VALUE_CHAR = /[0-9+]/;

  static init() {
    document.querySelectorAll(MaskView.SELECTOR).forEach((input) => new MaskView(input));
  }

  constructor(input) {
    if (input._maskView) return input._maskView;

    this.input = input;
    this.host = input.parentElement;
    this.lastValue = null;
    this.lastScroll = null;
    this.lastBox = null;

    this.view = document.createElement('span');
    this.view.className = 'mask-view';
    this.view.setAttribute('aria-hidden', 'true');
    this.text = document.createElement('span');
    this.text.className = 'mask-view__text';
    this.view.append(this.text);

    this.host.classList.add('mask-view-host');
    input.classList.add('mask-view-input');
    input.after(this.view);
    input._maskView = this;

    ['input', 'keyup', 'change', 'focus', 'blur', 'paste', 'scroll', 'maskview:refresh'].forEach((name) => {
      input.addEventListener(name, () => this.schedule());
    });
    window.addEventListener('resize', () => this.render(true));

    setInterval(() => this.render(), 300);

    this.render(true);
  }

  schedule() {
    this.render();
    requestAnimationFrame(() => this.render());
  }

  getBox() {
    const input = this.input;
    return `${input.offsetLeft}|${input.offsetTop}|${input.offsetWidth}|${input.offsetHeight}`;
  }

  syncBox() {
    const input = this.input;
    const cs = getComputedStyle(input);
    Object.assign(this.view.style, {
      left: input.offsetLeft + 'px',
      top: input.offsetTop + 'px',
      width: input.offsetWidth + 'px',
      height: input.offsetHeight + 'px',
      paddingTop: cs.paddingTop,
      paddingRight: cs.paddingRight,
      paddingBottom: cs.paddingBottom,
      paddingLeft: cs.paddingLeft,
      borderTopWidth: cs.borderTopWidth,
      borderRightWidth: cs.borderRightWidth,
      borderBottomWidth: cs.borderBottomWidth,
      borderLeftWidth: cs.borderLeftWidth,
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      fontStyle: cs.fontStyle,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
    });
  }

  render(force = false) {
    const value = this.input.value;
    const scroll = this.input.scrollLeft;
    const box = this.getBox();

    const valueChanged = force || value !== this.lastValue;
    const scrollChanged = scroll !== this.lastScroll;
    const boxChanged = box !== this.lastBox;

    if (!valueChanged && !scrollChanged && !boxChanged) return;

    if (force || boxChanged) this.syncBox();

    if (valueChanged) {
      this.text.textContent = '';
      for (const char of value) {
        const span = document.createElement('span');
        span.className = MaskView.VALUE_CHAR.test(char) ? 'mask-view__digit' : 'mask-view__symbol';
        span.textContent = char;
        this.text.append(span);
      }
    }

    this.text.style.transform = `translateX(${-scroll}px)`;
    this.lastValue = value;
    this.lastScroll = scroll;
    this.lastBox = box;
  }
}

MaskView.init();
