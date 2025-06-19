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
    setupISBNConverter('isbnInput', 'outputTable', 'hyphenateCheckbox', 'convertBtn');

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
    const lines = input.value.split(/\r?\n/).filter(line => line.trim());
    const useHyphenated = hyphenateCheckbox?.checked;
    tbody.innerHTML = ''; // Clear previous rows

    lines.forEach(line => {
      const raw = line.trim();
      const parsed = ISBN.parse(raw); // isbn comes from isbn3 global object

      const row = document.createElement('tr');

      const isValid = parsed?.isValid ?? false;

      let isbn10 = '';
      let isbn13 = '';

      if (isValid) {
        // Try to get isbn10
        if (parsed.isIsbn10) {
          isbn10 = useHyphenated ? parsed.isbn10h : parsed.isbn10;
          isbn13 = useHyphenated ? parsed.isbn13h : parsed.isbn13; // this will convert to ISBN-13
        } else if (parsed.isIsbn13) {
          isbn13 = useHyphenated ? parsed.isbn13h : parsed.isbn13;
          isbn10 = parsed.isbn10 ? (useHyphenated ? parsed.isbn10h : parsed.isbn10) : ''; // only if convertible
        }
      }

      const group = isValid ? parsed.groupname ?? '' : '';
      const publisher = isValid ? parsed.publisher ?? '' : '';

      row.innerHTML = `
        <td>${raw}</td>
        <td>${isbn10 || '-'}</td>
        <td>${isbn13 || '-'}</td>
        <td class="text-center">${isValid ? '<i class="bi bi-check-circle-fill text-success" title="Valid ISBN"></i>' : '<i class="bi bi-x-circle-fill text-danger" title="Invalid ISBN"></i>'}</td>
        <td>${group || '-'}</td>
        <td>${publisher || '-'}</td>
      `;

      tbody.appendChild(row);
    });
  });
}

