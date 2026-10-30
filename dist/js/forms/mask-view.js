/**
 * Подсветка введённого номера (цифры / символы маски)
 * ------------------------------------------------------------
 * Цифры номера выводятся цветом Black700, символы маски (скобки, дефисы, «_») — серым.
 * Внутри <input> покрасить символы по-разному нельзя, поэтому поверх поля рисуется
 * копия значения (.mask-view), а сам текст input делается прозрачным (остаётся каретка).
 *
 * Класс:      MaskView
 * Включается: если на странице есть `input.tel` или `input.telephone` или `input.telephone2`
 * Зависит от: —
 * Страницы:   см. STRUCTURE.md
 */

class MaskView {
  static SELECTOR = 'input.tel, input.telephone, input.telephone2';

  /** Символы, которые считаются «значением» (красятся тёмным) */
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

    // 'maskview:refresh' отправляют модули, которые меняют значение программно (например, FormSelect)
    ['input', 'keyup', 'change', 'focus', 'blur', 'paste', 'scroll', 'maskview:refresh'].forEach((name) => {
      input.addEventListener(name, () => this.schedule());
    });
    window.addEventListener('resize', () => this.render(true));

    // значение или положение поля может поменяться без событий
    // (input.value = …, reset формы, смена кода страны +7 → +995) — страхуемся лёгкой проверкой
    setInterval(() => this.render(), 300);

    this.render(true);
  }

  schedule() {
    this.render();
    requestAnimationFrame(() => this.render());
  }

  /** Положение и размер поля внутри родителя — по ним понимаем, что слой надо сдвинуть */
  getBox() {
    const input = this.input;
    return `${input.offsetLeft}|${input.offsetTop}|${input.offsetWidth}|${input.offsetHeight}`;
  }

  /** Повторяет размеры и шрифт поля, чтобы текст лёг ровно поверх */
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

    // положение/размер поля поменялись (например, код страны стал длиннее) — переставляем слой
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
