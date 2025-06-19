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

function setupISBNConverter(inputId, tableId, hyphenCheckboxId, buttonId) {
  const inputElem = document.getElementById(inputId);
  const tableElem = document.getElementById(tableId);
  const hyphenCheckbox = document.getElementById(hyphenCheckboxId);
  const convertButton = document.getElementById(buttonId);

  convertButton.addEventListener('click', () => {
    // Clear existing rows except header
    while (tableElem.rows.length > 1) {
      tableElem.deleteRow(1);
    }

    const useHyphenated = hyphenCheckbox?.checked ?? false;
    const lines = inputElem.value.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    lines.forEach((isbnStr) => {
      const parsed = isbn.parse(isbnStr);
      const isValid = parsed?.isValid ?? false;

      let isbn10 = '';
      let isbn13 = '';
      let group = '';
      let publisher = '';

      if (isValid) {
        if (parsed.isIsbn10) {
          isbn10 = useHyphenated ? parsed.isbn10h : parsed.isbn10;
          isbn13 = useHyphenated ? parsed.isbn13h : parsed.isbn13;
        } else if (parsed.isIsbn13) {
          isbn13 = useHyphenated ? parsed.isbn13h : parsed.isbn13;
          isbn10 = parsed.isbn10 ? (useHyphenated ? parsed.isbn10h : parsed.isbn10) : '';
        }

        group = parsed.group ?? '';
        publisher = parsed.publisher ?? '';
      }

      const row = tableElem.insertRow(-1);

      row.insertCell().textContent = isbnStr;
      row.insertCell().textContent = isbn10;
      row.insertCell().textContent = isbn13;

      const validCell = row.insertCell();
      if (isValid) {
        validCell.innerHTML = '<i class="bi bi-check-circle-fill text-success" title="Valid ISBN"></i>';
      } else {
        validCell.innerHTML = '<i class="bi bi-x-circle-fill text-danger" title="Invalid ISBN"></i>';
      }

      row.insertCell().textContent = group;
      row.insertCell().textContent = publisher;
    });
  });
}

