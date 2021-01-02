document.addEventListener('DOMContentLoaded', function () {
  const btnMenu = document.querySelector('#menu-trigger');
  const menu = document.querySelector('#menu');

  function btnMenuIsVisible() {
    return window.getComputedStyle(btnMenu).display === 'block';
  }

  btnMenu.addEventListener('click', function (e) {
    if (!btnMenuIsVisible()) return;
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    e.preventDefault();
  });

  document.addEventListener('click', function (e) {
    if (!btnMenuIsVisible()) return;
    if (
      !btnMenu.isEqualNode(e.target) &&
      !btnMenu.contains(e.target) &&
      !menu.isEqualNode(e.target) &&
      !menu.contains(e.target)
    ) {
      menu.style.display = 'none';
    }
  });
});
