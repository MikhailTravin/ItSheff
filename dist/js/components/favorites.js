/**
 * Избранное
 * ------------------------------------------------------------
 * .favorites
 *
 * Класс:      Favorites
 * Включается: если на странице есть `.favorites`
 * Зависит от: —
 * Страницы:   cart-empty, cart, home, invoices-auto-payment, invoices-details, invoices, services-product, services
 */

class Favorites {
  static init() {
    const favoritesElements = document.querySelectorAll('.favorites');

    if (favoritesElements) {
      favoritesElements.forEach(element => {
        element.addEventListener('click', function (e) {
          e.preventDefault();

          this.classList.toggle('active');

          e.stopPropagation();
        });
      });
    }
  }
}

Favorites.init();
