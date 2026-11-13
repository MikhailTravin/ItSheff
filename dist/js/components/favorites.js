/**
  Избранное
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
