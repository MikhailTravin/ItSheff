# Структура JS ITsheff

Раньше весь код лежал в одном `scripts.js` (8 000 строк), который грузился на всех страницах. Теперь он разбит на небольшие модули: **один файл — одна возможность**, каждая оформлена классом и подключается только на тех страницах, где она нужна.

## Папки

```
dist/js/
├── core/         утилиты и общие вещи (bodyLock, slide-анимации, gotoBlock, меню, DynamicAdapt, ScrollWatcher)
├── components/   интерфейсные компоненты (табы, спойлеры, шапка, слайдеры, таймеры…)
├── forms/        формы: валидация, отправка, поля, календарь, загрузка файлов
├── popups/       попапы и всё, что работает внутри них
├── loader/       окно «Загрузчика» (528×670): уведомления, опрос, прогресс
├── pages/        скрипты, которые нужны одной странице (home, swagger)
└── vendor/       сторонние библиотеки (simplebar, inputmask, nouislider, swiper, swagger)
```

## Как устроен модуль

Каждый файл начинается с шапки-описания (что делает, по какому селектору включается, от чего зависит, на каких страницах подключён), дальше — класс:

```js
class ButtonUp {
  static init() {
    const buttonUp = document.querySelector('.button-up');
    if (buttonUp) { /* … */ }
  }
}

ButtonUp.init();
```

- Логика внутри осталась прежней — поменялась только упаковка. Все переменные теперь локальны для `init()`, а не висят глобально.
- Если нужного элемента на странице нет, модуль ничего не делает.
- Общие вещи (`bodyLock`, `gotoBlock`, `FormValidate`, `modules_flsModules.popup`…) остались глобальными — на них опираются несколько модулей.

## Как подключаются скрипты на странице

Список задаётся прямо в шаблоне страницы, перед include:

```njk
{% set scripts = [
    'core/helpers',
    'components/tabs',
    'loader/notifications'
] %}
{% include 'blocks/scripts.njk' %}
```

`blocks/scripts.njk` просто выводит `<script src="js/…js">` по этому списку. Порядок важен: сначала vendor и `core/*`, потом остальное.
Скрипт капчи в `<head>` подключается только если на странице `{% set useCaptcha = true %}` (там, где есть `.smart-captcha`).

**Добавить новую возможность:** создать файл-класс в нужной папке → добавить его id в `scripts` тех страниц, где он нужен.
**Если модуль зависит от другого** (например, `forms/form-submit` ← `forms/form-validate`), зависимость должна стоять в списке выше.

## Модули

| Файл | Класс | Включается, если на странице есть |
|---|---|---|
| `core/helpers.js` | — | всегда |
| `core/shared-refs.js` | — | всегда |
| `core/menu.js` | — | всегда |
| `core/scroll-to.js` | — | всегда |
| `forms/form-validate.js` | FormValidate | `form`, `[data-popup]`, `.popup` |
| `popups/popup.js` | Popup | `[data-popup]`, `.popup` |
| `components/more-buttons.js` | MoreButtons | `.btn-more` |
| `components/form-quantity.js` | FormQuantity | `[data-quantity]` |
| `components/card-subscriptions.js` | CardSubscriptions | `.card-subscriptions` |
| `components/spollers.js` | Spollers | `[data-spollers]`, `[data-spoller]` |
| `components/tabs.js` | Tabs | `[data-tabs]`, `[data-tabs-cart]` |
| `components/header-notifications.js` | HeaderNotifications | `.header .header-notifications` |
| `components/header-menu.js` | HeaderMenu | `.header-menu` |
| `components/block-pagination.js` | BlockPagination | `.block-pagination` |
| `components/table-meatballs.js` | TableMeatballs | `.cabinet-table-meatballs__button` |
| `components/cabinet-details.js` | CabinetDetails | `.cabinet-details-descr__buttons` |
| `components/cabinet-menus.js` | CabinetMenus | `.cabinet-objects-bottom` |
| `popups/popup-details-tabs.js` | PopupDetailsTabs | `.popup-details-tabs` |
| `forms/input-masks.js` | InputMasks | `.telephone`, `.telephone2`, `.input-timer` |
| `forms/form-fields.js` | FormFields | `input`, `textarea` |
| `forms/form-submit.js` | FormSubmit | `form`, `button.btn-next[data-popup]` |
| `forms/form-account-access.js` | FormAccountAccess | `.form-account-access` |
| `forms/form-rating.js` | FormRating | `[data-rating]` |
| `forms/file-uploaders.js` | FileUploaders | `.form-textarea__bottom`, `.audio-record`, `.file-input` |
| `forms/form-select.js` | FormSelect | `.form-select__titles` |
| `forms/mask-view.js` | MaskView | `input.tel`, `input.telephone`, `input.telephone2` |
| `popups/popup-base-observer.js` | PopupBaseObserver | `.popup-base-created` |
| `components/tooltips.js` | Tooltips | `.tooltips-button`, `.tooltips` |
| `components/button-check.js` | ButtonCheck | `.btn-check` |
| `forms/calendar.js` | Calendars | `.calendar` |
| `components/start-update-buttons.js` | StartUpdateButtons | `.popup-start-update__btn` |
| `components/cabinet-order-buttons.js` | CabinetOrderButtons | `.cabinet-tabs-act-order__button` |
| `components/timers.js` | Timers | `.timer` |
| `components/show-more.js` | ShowMore | `[data-showmore]` |
| `forms/select-bases.js` | SelectBases | `.popup-select-bases` |
| `forms/upload-base-files.js` | UploadBaseFiles | `.upload-base-files` |
| `forms/form-auto-update.js` | FormAutoUpdate | `.form-auto-update` |
| `components/applications-cards.js` | ApplicationsCards | `.block-applications-cards__card` |
| `components/applications-columns.js` | ApplicationsColumns | `.block-applications__column` |
| `forms/add-textarea.js` | AddTextarea | `.add-textarea` |
| `forms/select-bases-search.js` | SelectBasesSearch | `.select-bases-search` |
| `components/button-copy.js` | ButtonCopy | `.btn-copy` |
| `components/role-tabs.js` | RoleTabs | `.options2__item` |
| `components/draggable.js` | Draggable | `.block-cabinet__dragging` |
| `forms/form-textareas.js` | FormTextareas | `.form-textarea` |
| `components/page-navigation.js` | PageNavigation | `[data-goto]`, `[data-watch]` |
| `components/button-up.js` | ButtonUp | `.button-up` |
| `components/options3.js` | Options3 | `.options3__input` |
| `popups/popup-systems.js` | PopupSystems | `.popup-systems__name.button-out` |
| `components/recommend-sliders.js` | RecommendSliders | `.block-recommend__slider` |
| `components/favorites.js` | Favorites | `.favorites` |
| `components/header-menu-selects.js` | HeaderMenuSelects | `.header-menu-select` |
| `components/breadcrumbs.js` | Breadcrumbs | `.breadcrumbs2` |
| `components/header-height.js` | HeaderHeight | `.header` |
| `components/fixed-bottom-spacing.js` | FixedBottomSpacing | `.header-bottom__right`, `.cabinet-menu`, `.footer`, `.main` |
| `components/digits-counter.js` | DigitsCounter | `[data-digits-counter]` |
| `loader/quiz.js` | LoaderQuiz | `.loader-quiz` |
| `loader/progress.js` | LoaderProgress | `.loader-progress` |
| `pages/home.js` | HomeRotator, PicAnimations, NewsSlider, BlockReviews, CabinetShowcase | только home.html |

## Что подключено на каждой странице

**account-access.html** (10): `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `popups/popup`, `forms/form-fields`, `forms/form-submit`, `forms/form-account-access`, `components/fixed-bottom-spacing`

**account-blocked.html** (5): `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `components/fixed-bottom-spacing`

**cart-empty.html** (20): `vendor/swiper-8.4.7.min`, `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `popups/popup`, `components/spollers`, `components/tabs`, `components/header-notifications`, `components/header-menu`, `forms/form-fields`, `forms/form-submit`, `components/page-navigation`, `components/recommend-sliders`, `components/favorites`, `components/header-height`, `components/fixed-bottom-spacing`, `core/scroll-watcher`

**cart.html** (26): `vendor/inputmask.min`, `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `popups/popup`, `components/form-quantity`, `components/spollers`, `components/tabs`, `components/header-notifications`, `components/header-menu`, `forms/input-masks`, `forms/form-fields`, `forms/form-submit`, `forms/form-select`, `forms/mask-view`, `popups/popup-base-observer`, `components/tooltips`, `forms/calendar`, `components/show-more`, `forms/select-bases`, `components/favorites`, `components/header-height`, `components/fixed-bottom-spacing`

**databases-empty.html** (12): `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `components/spollers`, `components/header-notifications`, `components/header-menu`, `forms/form-fields`, `components/header-height`, `components/fixed-bottom-spacing`

**databases.html** (27): `vendor/inputmask.min`, `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `popups/popup`, `components/spollers`, `components/header-notifications`, `components/header-menu`, `components/cabinet-menus`, `forms/input-masks`, `forms/form-fields`, `forms/form-submit`, `forms/form-select`, `popups/popup-base-observer`, `forms/calendar`, `components/start-update-buttons`, `components/timers`, `components/show-more`, `forms/select-bases`, `forms/upload-base-files`, `forms/form-auto-update`, `components/draggable`, `components/header-height`, `components/fixed-bottom-spacing`

**documents-detail1.html** (10): `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `components/spollers`, `components/header-menu`, `components/page-navigation`, `components/button-up`, `components/fixed-bottom-spacing`

**documents-detail2.html** (10): `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `components/spollers`, `components/header-menu`, `components/fixed-bottom-spacing`, `vendor/swagger-ui-bundle`, `pages/init-swagger-ui`

**documents.html** (8): `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `components/spollers`, `components/header-menu`, `components/fixed-bottom-spacing`

**home.html** (29): `vendor/swiper-8.4.7.min`, `vendor/inputmask.min`, `core/dynamic-adapt`, `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `popups/popup`, `components/spollers`, `components/header-menu`, `forms/input-masks`, `forms/form-fields`, `forms/form-submit`, `forms/form-select`, `forms/mask-view`, `popups/popup-base-observer`, `components/tooltips`, `components/show-more`, `components/page-navigation`, `components/favorites`, `components/header-menu-selects`, `components/breadcrumbs`, `components/header-height`, `components/fixed-bottom-spacing`, `components/digits-counter`, `core/scroll-watcher`, `pages/home`

**invoices-auto-payment.html** (32): `vendor/inputmask.min`, `core/dynamic-adapt`, `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `popups/popup`, `components/more-buttons`, `components/spollers`, `components/tabs`, `components/header-menu`, `components/block-pagination`, `components/table-meatballs`, `components/cabinet-details`, `popups/popup-details-tabs`, `forms/form-fields`, `forms/form-submit`, `forms/form-select`, `forms/mask-view`, `popups/popup-base-observer`, `components/tooltips`, `components/button-check`, `forms/calendar`, `components/cabinet-order-buttons`, `components/page-navigation`, `components/favorites`, `components/header-menu-selects`, `components/breadcrumbs`, `components/header-height`, `components/fixed-bottom-spacing`

**invoices-details.html** (32): `vendor/inputmask.min`, `core/dynamic-adapt`, `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `popups/popup`, `components/more-buttons`, `components/spollers`, `components/tabs`, `components/header-menu`, `components/block-pagination`, `components/table-meatballs`, `components/cabinet-details`, `popups/popup-details-tabs`, `forms/form-fields`, `forms/form-submit`, `forms/form-select`, `forms/mask-view`, `popups/popup-base-observer`, `components/tooltips`, `components/button-check`, `forms/calendar`, `components/cabinet-order-buttons`, `components/page-navigation`, `components/favorites`, `components/header-menu-selects`, `components/breadcrumbs`, `components/header-height`, `components/fixed-bottom-spacing`

**invoices-empty.html** (11): `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `components/spollers`, `components/tabs`, `components/header-notifications`, `components/header-menu`, `components/header-height`, `components/fixed-bottom-spacing`

**invoices.html** (32): `vendor/inputmask.min`, `core/dynamic-adapt`, `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `popups/popup`, `components/more-buttons`, `components/spollers`, `components/tabs`, `components/header-menu`, `components/block-pagination`, `components/table-meatballs`, `components/cabinet-details`, `popups/popup-details-tabs`, `forms/form-fields`, `forms/form-submit`, `forms/form-select`, `forms/mask-view`, `popups/popup-base-observer`, `components/tooltips`, `components/button-check`, `forms/calendar`, `components/cabinet-order-buttons`, `components/page-navigation`, `components/favorites`, `components/header-menu-selects`, `components/breadcrumbs`, `components/header-height`, `components/fixed-bottom-spacing`

**loader-login-error.html** (16): `vendor/inputmask.min`, `vendor/simplebar.min`, `vendor/nouislider.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `popups/popup`, `forms/form-fields`, `forms/form-submit`, `forms/form-select`, `components/breadcrumbs`, `components/fixed-bottom-spacing`, `loader/quiz`, `loader/notifications`

**loader-login.html** (16): `vendor/inputmask.min`, `vendor/simplebar.min`, `vendor/nouislider.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `popups/popup`, `forms/form-fields`, `forms/form-submit`, `forms/form-select`, `components/breadcrumbs`, `components/fixed-bottom-spacing`, `loader/quiz`, `loader/notifications`

**loader-progress.html** (13): `vendor/simplebar.min`, `vendor/nouislider.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `forms/form-fields`, `components/breadcrumbs`, `components/fixed-bottom-spacing`, `loader/quiz`, `loader/progress`, `loader/notifications`

**loader.html** (28): `vendor/simplebar.min`, `vendor/nouislider.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `popups/popup`, `components/more-buttons`, `components/form-quantity`, `components/card-subscriptions`, `components/tabs`, `forms/form-fields`, `forms/form-submit`, `forms/form-rating`, `forms/file-uploaders`, `popups/popup-base-observer`, `components/tooltips`, `components/show-more`, `components/applications-cards`, `components/applications-columns`, `components/draggable`, `forms/form-textareas`, `popups/popup-systems`, `components/breadcrumbs`, `components/fixed-bottom-spacing`, `loader/quiz`, `loader/notifications`

**login.html** (9): `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `popups/popup`, `forms/form-fields`, `forms/form-submit`, `components/fixed-bottom-spacing`

**registration.html** (14): `vendor/inputmask.min`, `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `popups/popup`, `forms/form-fields`, `forms/form-submit`, `forms/form-select`, `forms/mask-view`, `components/tooltips`, `components/fixed-bottom-spacing`

**services-product.html** (29): `vendor/swiper-8.4.7.min`, `vendor/inputmask.min`, `core/dynamic-adapt`, `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `popups/popup`, `components/spollers`, `components/header-notifications`, `components/header-menu`, `forms/input-masks`, `forms/form-fields`, `forms/form-submit`, `forms/form-select`, `forms/mask-view`, `popups/popup-base-observer`, `components/tooltips`, `components/show-more`, `components/page-navigation`, `components/recommend-sliders`, `components/favorites`, `components/header-menu-selects`, `components/breadcrumbs`, `components/header-height`, `components/fixed-bottom-spacing`, `core/scroll-watcher`

**services-store.html** (25): `vendor/swiper-8.4.7.min`, `vendor/inputmask.min`, `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `popups/popup`, `components/spollers`, `components/header-notifications`, `components/header-menu`, `forms/form-fields`, `forms/form-submit`, `forms/form-select`, `forms/mask-view`, `popups/popup-base-observer`, `components/tooltips`, `components/page-navigation`, `components/recommend-sliders`, `components/header-menu-selects`, `components/header-height`, `components/fixed-bottom-spacing`, `core/scroll-watcher`, `pages/services-store`

**services.html** (30): `vendor/swiper-8.4.7.min`, `vendor/inputmask.min`, `core/dynamic-adapt`, `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `popups/popup`, `components/spollers`, `components/header-notifications`, `components/header-menu`, `forms/input-masks`, `forms/form-fields`, `forms/form-submit`, `forms/form-select`, `forms/mask-view`, `popups/popup-base-observer`, `components/tooltips`, `components/show-more`, `components/page-navigation`, `components/recommend-sliders`, `components/favorites`, `components/header-menu-selects`, `components/breadcrumbs`, `components/header-height`, `components/fixed-bottom-spacing`, `components/digits-counter`, `core/scroll-watcher`

**subscriptions-empty.html** (18): `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `popups/popup`, `components/spollers`, `components/tabs`, `components/header-notifications`, `components/header-menu`, `popups/popup-details-tabs`, `forms/form-fields`, `forms/form-submit`, `components/tooltips`, `components/button-check`, `components/header-height`, `components/fixed-bottom-spacing`

**subscriptions-restoring.html** (10): `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `components/spollers`, `components/header-notifications`, `components/header-menu`, `components/header-height`, `components/fixed-bottom-spacing`

**subscriptions-restoring2.html** (10): `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `components/spollers`, `components/header-notifications`, `components/header-menu`, `components/header-height`, `components/fixed-bottom-spacing`

**subscriptions.html** (36): `vendor/swiper-8.4.7.min`, `vendor/inputmask.min`, `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `popups/popup`, `components/more-buttons`, `components/form-quantity`, `components/card-subscriptions`, `components/spollers`, `components/tabs`, `components/header-notifications`, `components/header-menu`, `popups/popup-details-tabs`, `forms/form-fields`, `forms/form-submit`, `forms/form-select`, `forms/mask-view`, `popups/popup-base-observer`, `components/tooltips`, `components/button-check`, `forms/calendar`, `components/show-more`, `forms/select-bases`, `forms/upload-base-files`, `forms/form-auto-update`, `components/page-navigation`, `components/options3`, `popups/popup-systems`, `components/recommend-sliders`, `components/header-height`, `components/fixed-bottom-spacing`, `core/scroll-watcher`

**support.html** (22): `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `popups/popup`, `components/spollers`, `components/tabs`, `components/header-notifications`, `components/header-menu`, `forms/form-fields`, `forms/form-submit`, `forms/form-rating`, `forms/file-uploaders`, `components/tooltips`, `components/applications-cards`, `components/applications-columns`, `forms/add-textarea`, `forms/form-textareas`, `components/header-height`, `components/fixed-bottom-spacing`

**users.html** (23): `vendor/inputmask.min`, `vendor/simplebar.min`, `core/helpers`, `core/shared-refs`, `core/menu`, `core/scroll-to`, `forms/form-validate`, `popups/popup`, `components/spollers`, `components/header-notifications`, `components/header-menu`, `components/cabinet-menus`, `forms/form-fields`, `forms/form-submit`, `forms/form-select`, `forms/mask-view`, `components/show-more`, `forms/select-bases`, `forms/select-bases-search`, `components/button-copy`, `components/role-tabs`, `components/header-height`, `components/fixed-bottom-spacing`

## Что ещё поменялось

- `loader/notifications.js` (бывший `loader.js`) переписан в класс `LoaderNotifications`. Первый блок старого файла (работа с `[data-loader]`) удалён: такой разметки нет ни на одной странице.
- Опрос и прогресс загрузчика (`LoaderQuiz`, `LoaderProgress`) вынесены из `scripts.js` в `loader/quiz.js` и `loader/progress.js`.
- `formValidate` (объект) стал статическим классом `FormValidate`; `formFieldsInit`, `spollers`, `tabs` и остальные функции — методами классов (`FormFields.init()`, `Spollers.init()`, `Tabs.init()`…).
- Inline-стили заменены классами: цвета карточек подписок (`card-subscriptions__items--blue/yellow/sky/violet/ice`), уменьшенный логотип (`block-cabinet-top__pic1--compact`), перевёрнутая иконка (`icon-flip`). Правила добавлены в `src/scss/_cards.scss`, `_blocks.scss`, `_common.scss` и вручную в конец `dist/css/styles.css` (SCSS-компилятора в окружении не было — при следующей сборке файл пересоберётся сам).
- Оставлены inline `display: none` и `width: 25%`: их меняет JS.
