/**
 * Перетаскивание блоков
 * ------------------------------------------------------------
 * Draggable.init(контейнер, элемент, ручка) — drag&drop кабинета.
 *
 * Класс:      Draggable
 * Включается: если на странице есть `.block-cabinet__dragging`
 * Зависит от: —
 * Страницы:   databases, loader
 */

class Draggable {
  static init(containerSelector, itemSelector, handleSelector, options = {}) {
    const columnsContainer = document.querySelector(containerSelector);
    if (!columnsContainer) return;

    const {
      dragThreshold = 3,
      swapDownPercent = -35,
      swapUpPercent = -50,
      edgeSwapThreshold = 50,
      animationSpeed = 0.2,
    } = options;

    const columns = columnsContainer.querySelectorAll(itemSelector);
    if (!columns.length) return;

    let draggedColumn = null;
    let offsetX, offsetY;
    let startX, startY;
    let activePicker = null;
    let isDragging = false;
    let clone = null;

    const DRAG_THRESHOLD = dragThreshold;
    const SWAP_THRESHOLD_DOWN_PERCENT = swapDownPercent;
    const SWAP_THRESHOLD_UP_PERCENT = swapUpPercent;
    const EDGE_SWAP_THRESHOLD = edgeSwapThreshold;
    const ANIMATION_SPEED = animationSpeed;

    const styleId = 'drag-style-' + containerSelector.replace(/\W/g, '') + '-' + itemSelector.replace(/\W/g, '');
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
      ${containerSelector} ${itemSelector} {
        transition: transform ${ANIMATION_SPEED}s cubic-bezier(0.2, 0, 0, 1);
        position: relative;
      }
      ${containerSelector} ${itemSelector}.drag-placeholder {
        opacity: 0.3;
        pointer-events: none;
      }
      .block-cabinet__drag-clone {
        position: fixed;
        z-index: 10000;
        pointer-events: none;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        opacity: 0.95;
        cursor: grabbing;
      }
      ${handleSelector} {
        cursor: grab;
        transition: opacity 0.15s ease, transform 0.15s ease;
        touch-action: none;
        user-select: none;
      }
      ${handleSelector}.active {
        cursor: grabbing;
        opacity: 0.7;
        transform: scale(0.9);
      }
      ${handleSelector} svg {
        pointer-events: none;
      }
    `;
      document.head.appendChild(style);
    }

    function savePositions() {
      const allColumns = columnsContainer.querySelectorAll(`${itemSelector}:not(.drag-placeholder)`);
      allColumns.forEach(column => {
        const rect = column.getBoundingClientRect();
        column.dataset.prevTop = rect.top;
        column.dataset.prevLeft = rect.left;
      });
    }

    function animatePositions() {
      const allColumns = columnsContainer.querySelectorAll(`${itemSelector}:not(.drag-placeholder)`);
      allColumns.forEach(column => {
        const prevTop = parseFloat(column.dataset.prevTop || 0);
        const prevLeft = parseFloat(column.dataset.prevLeft || 0);
        const rect = column.getBoundingClientRect();

        const deltaY = prevTop - rect.top;
        const deltaX = prevLeft - rect.left;

        if (Math.abs(deltaY) > 0 || Math.abs(deltaX) > 0) {
          column.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
          column.style.transition = 'none';

          column.offsetHeight;

          column.style.transform = '';
          column.style.transition = '';
        }
      });
    }

    function createClone(column) {
      const cloneEl = column.cloneNode(true);
      const rect = column.getBoundingClientRect();

      cloneEl.classList.add('block-cabinet__drag-clone');
      cloneEl.style.width = rect.width + 'px';
      cloneEl.style.height = rect.height + 'px';

      // Отключаем инпуты в клоне, чтобы не мешали radio-группам
      cloneEl.querySelectorAll('input').forEach(i => {
        i.disabled = true;
        i.tabIndex = -1;
      });

      return cloneEl;
    }

    function updateClonePosition(touch) {
      if (!clone) return;

      const containerRect = columnsContainer.getBoundingClientRect();

      let newX = touch.clientX - offsetX;
      let newY = touch.clientY - offsetY;

      const minX = containerRect.left;
      const maxX = containerRect.right - clone.offsetWidth;
      const minY = containerRect.top;
      const maxY = containerRect.bottom - clone.offsetHeight;

      newX = Math.max(minX, Math.min(newX, maxX));
      newY = Math.max(minY, Math.min(newY, maxY));

      clone.style.left = newX + 'px';
      clone.style.top = newY + 'px';
    }

    function getClosestInsertPosition(touchY) {
      const allColumns = Array.from(columnsContainer.querySelectorAll(`${itemSelector}:not(.drag-placeholder)`));
      let closestColumn = null;
      let minDistance = Infinity;
      let insertBefore = false;

      allColumns.forEach(column => {
        const rect = column.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const distance = Math.abs(touchY - centerY);

        if (distance < minDistance) {
          minDistance = distance;
          closestColumn = column;
          insertBefore = touchY < centerY;
        }
      });

      return { closestColumn, insertBefore };
    }

    columns.forEach(column => {
      const picker = column.querySelector(handleSelector);
      if (!picker) return;

      picker.addEventListener('mousedown', initDrag);
      picker.addEventListener('touchstart', initDrag, { passive: false });
    });

    function initDrag(e) {
      const column = e.target.closest(itemSelector);
      if (!column) return;
      if (!columnsContainer.contains(column)) return;

      e.preventDefault();
      e.stopPropagation();

      const touch = e.touches ? e.touches[0] : e;

      startX = touch.clientX;
      startY = touch.clientY;

      draggedColumn = column;
      isDragging = false;

      const rect = column.getBoundingClientRect();
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;

      const picker = column.querySelector(handleSelector);
      if (picker) {
        picker.classList.add('active');
        activePicker = picker;
      }

      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchmove', onDrag, { passive: false });
      document.addEventListener('touchend', stopDrag);
    }

    function onDrag(e) {
      if (!draggedColumn) return;

      e.preventDefault();

      const touch = e.touches ? e.touches[0] : e;
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      if (!isDragging) {
        if (Math.abs(deltaX) < DRAG_THRESHOLD && Math.abs(deltaY) < DRAG_THRESHOLD) {
          return;
        }
        isDragging = true;

        savePositions();

        clone = createClone(draggedColumn);
        document.body.appendChild(clone);

        draggedColumn.classList.add('drag-placeholder');

        updateClonePosition(touch);
      }

      updateClonePosition(touch);

      const allColumns = Array.from(columnsContainer.querySelectorAll(`${itemSelector}:not(.drag-placeholder)`));
      const draggedIndex = allColumns.indexOf(draggedColumn);
      const containerRect = columnsContainer.getBoundingClientRect();
      const cloneRect = clone.getBoundingClientRect();
      const cloneTop = cloneRect.top;
      const cloneBottom = cloneRect.bottom;
      const cloneCenterX = cloneRect.left + cloneRect.width / 2;

      let swapWithColumn = null;
      let swapBefore = false;
      let isEdgeSwap = false;

      if (draggedIndex > 0 && cloneTop - containerRect.top < EDGE_SWAP_THRESHOLD) {
        const firstColumn = allColumns[0];
        if (firstColumn !== draggedColumn) {
          swapWithColumn = firstColumn;
          swapBefore = true;
          isEdgeSwap = true;
        }
      }
      else if (draggedIndex < allColumns.length - 1 && containerRect.bottom - cloneBottom < EDGE_SWAP_THRESHOLD) {
        const lastColumn = allColumns[allColumns.length - 1];
        if (lastColumn !== draggedColumn) {
          swapWithColumn = lastColumn;
          swapBefore = false;
          isEdgeSwap = true;
        }
      }

      if (!isEdgeSwap) {
        allColumns.forEach((column, index) => {
          if (column === draggedColumn) return;

          const rect = column.getBoundingClientRect();
          const height = rect.height;
          const isOverX = cloneCenterX >= rect.left && cloneCenterX <= rect.right;

          if (!isOverX) return;

          if (index > draggedIndex) {
            const overlapFromTop = cloneTop - rect.top;
            const overlapPercent = (overlapFromTop / height) * 100;

            if (overlapPercent >= SWAP_THRESHOLD_DOWN_PERCENT) {
              swapWithColumn = column;
              swapBefore = false;
            }
          }
          else if (index < draggedIndex) {
            const overlapFromBottom = rect.bottom - cloneBottom;
            const overlapPercent = (overlapFromBottom / height) * 100;

            if (overlapPercent >= SWAP_THRESHOLD_UP_PERCENT) {
              swapWithColumn = column;
              swapBefore = true;
            }
          }
        });
      }

      if (swapWithColumn) {
        savePositions();

        if (swapBefore) {
          columnsContainer.insertBefore(draggedColumn, swapWithColumn);
        } else {
          columnsContainer.insertBefore(draggedColumn, swapWithColumn.nextSibling);
        }

        animatePositions();

        const newDraggedIndex = Array.from(columnsContainer.querySelectorAll(`${itemSelector}:not(.drag-placeholder)`)).indexOf(draggedColumn);
        if (newDraggedIndex !== draggedIndex) {
          setTimeout(() => {
            if (clone && draggedColumn) {
              const newRect = draggedColumn.getBoundingClientRect();
              const touchPoint = touch;
              offsetX = touchPoint.clientX - newRect.left;
              offsetY = touchPoint.clientY - newRect.top;
              updateClonePosition(touchPoint);
            }
          }, ANIMATION_SPEED * 1000);
        }
      }
    }

    function stopDrag(e) {
      if (!draggedColumn) return;

      if (activePicker) {
        activePicker.classList.remove('active');
        activePicker = null;
      }

      if (isDragging && clone) {
        const touch = e.changedTouches ? e.changedTouches[0] : e;
        const { closestColumn, insertBefore } = getClosestInsertPosition(touch.clientY);

        if (closestColumn && closestColumn !== draggedColumn) {
          if (insertBefore) {
            columnsContainer.insertBefore(draggedColumn, closestColumn);
          } else {
            columnsContainer.insertBefore(draggedColumn, closestColumn.nextSibling);
          }
        }
      }

      if (clone) {
        clone.remove();
        clone = null;
      }

      draggedColumn.classList.remove('drag-placeholder');

      columnsContainer.querySelectorAll(itemSelector).forEach(col => {
        col.style.transform = '';
        col.style.transition = '';
      });

      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchmove', onDrag);
      document.removeEventListener('touchend', stopDrag);

      draggedColumn = null;
      isDragging = false;
    }
  }
}

Draggable.init(
  '.block-cabinet__dragging',
  '.block-cabinet__column',
  '.cabinet-objects-top__picker'
);

Draggable.init(
  '.block-cabinet__dragging',
  '.checkbox-bases',
  '.cabinet-objects-top__picker'
);
