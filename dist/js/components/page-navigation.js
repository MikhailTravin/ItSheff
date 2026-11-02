/**
 * Навигация по странице
 * ------------------------------------------------------------
 * [data-goto] / [data-watch="navigator"] — якоря и подсветка.
 *
 * Класс:      PageNavigation
 * Включается: если на странице есть `[data-goto]` или `[data-watch]`
 * Зависит от: core/scroll-to, core/menu, core/helpers
 * Страницы:   cart-empty, documents-detail1, home, invoices-auto-payment, invoices-details, invoices, services-product, services-store, services, subscriptions
 */

class PageNavigation {
  static init() {
    const navigatorSections = [];

    document.addEventListener("click", pageNavigationAction);
    document.addEventListener("watcherCallback", pageNavigationAction);

    function collectNavigatorSections() {
      navigatorSections.length = 0;
      document.querySelectorAll('[data-watch="navigator"]').forEach(section => {
        navigatorSections.push({
          section,
          links: findNavigatorLinks(section),
          active: false
        });
      });
    }

    function findNavigatorLinks(element) {
      const links = [];

      if (element.id) {
        const idLinks = document.querySelectorAll(`[data-goto="#${element.id}"]`);
        links.push(...idLinks);
      }

      if (element.classList.length) {
        element.classList.forEach(className => {
          const classLinks = document.querySelectorAll(`[data-goto=".${className}"]`);
          links.push(...classLinks);
        });
      }

      if (element.dataset.watchSelector) {
        const selectorLinks = document.querySelectorAll(`[data-goto="${element.dataset.watchSelector}"]`);
        links.push(...selectorLinks);
      }

      return [...new Set(links)];
    }

    function setActiveLink(section, isActive) {
      const record = navigatorSections.find(r => r.section === section);
      if (!record) return;

      if (record.active === isActive) return;
      record.active = isActive;

      if (isActive) {
        document.querySelectorAll('[data-goto]._navigator-active').forEach(el => {
          el.classList.remove('_navigator-active');
        });
        record.links.forEach(link => link.classList.add('_navigator-active'));
      } else {
        record.links.forEach(link => link.classList.remove('_navigator-active'));
      }
    }

    function pageNavigationAction(e) {
      if (e.type === "click") {
        const targetElement = e.target;
        const gotoLink = targetElement.closest('[data-goto]');

        if (gotoLink) {
          const gotoLinkSelector = gotoLink.dataset.goto || '';
          const noHeader = gotoLink.hasAttribute('data-goto-header');
          const gotoSpeed = gotoLink.dataset.gotoSpeed ? parseInt(gotoLink.dataset.gotoSpeed) : 500;
          const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;

          if (window.modules_flsModules && modules_flsModules.fullpage) {
            const fullpageSection = document.querySelector(`${gotoLinkSelector}`)?.closest('[data-fp-section]');
            const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fpId : null;

            if (fullpageSectionId !== null) {
              modules_flsModules.fullpage.switchingSection(fullpageSectionId);
              if (document.documentElement.classList.contains("menu-open") && typeof menuClose === 'function') {
                menuClose();
              }
            }
          } else {
            gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
          }

          e.preventDefault();
        }
      } else if (e.type === "watcherCallback" && e.detail) {
        const entry = e.detail.entry;
        const targetElement = entry.target;

        if (targetElement.dataset.watch === 'navigator') {
          if (entry.isIntersecting) {
            setActiveLink(targetElement, true);
          } else {
            setActiveLink(targetElement, false);
          }
        }
      }
    }

    collectNavigatorSections();

    PageNavigation.update = collectNavigatorSections;
  }
}

PageNavigation.init();
