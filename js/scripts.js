/*!
* Start Bootstrap - Scrolling Nav v5.0.6 (https://startbootstrap.com/template/scrolling-nav)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-scrolling-nav/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Initialize
    setupISBNConverter('isbnInput', 'outputTable', 'convertBtn', 'useDashes');

});

function setupISBNConverter({
  inputId = 'isbnInput',
  tableId = 'outputTable',
  buttonId = 'convertBtn',
  hyphenateCheckboxId = 'hyphenateCheckbox'
} = {}) {
  const input = document.getElementById(inputId);
  const table = document.getElementById(tableId);
  const tbody = table.querySelector('tbody') || table.appendChild(document.createElement('tbody'));
  const button = document.getElementById(buttonId);
  const hyphenateCheckbox = document.getElementById(hyphenateCheckboxId);

  button.addEventListener('click', () => {
    const lines = input.value.split(/\r?\n/);
    const useHyphenated = hyphenateCheckbox?.checked;
    tbody.innerHTML = ''; // Clear previous rows

    lines.forEach(line => {
      const raw = line.trim();
      if (!raw) return;

      const parsed = ISBN.parse(raw);
      const row = document.createElement('tr');

      const isbn10 = parsed?.isIsbn10 ? (useHyphenated ? parsed.isbn10h : parsed.isbn10) : '';
      const isbn13 = parsed?.isIsbn13 ? (useHyphenated ? parsed.isbn13h : parsed.isbn13) : '';
      const isValid = parsed?.isValid ?? false;
      const group = parsed?.groupname ?? '';
      const publisher = parsed?.publisher ?? '';

      row.innerHTML = `
        <td>${raw}</td>
        <td>${isbn10 || '-'}</td>
        <td>${isbn13 || '-'}</td>
        <td>${isValid ? '✅' : '❌'}</td>
        <td>${group || '-'}</td>
        <td>${publisher || '-'}</td>
      `;
      tbody.appendChild(row);
    });
  });
}
