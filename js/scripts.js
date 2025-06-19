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

  function setupISBNConverter(inputId, tableId, buttonId, checkboxId) {
    const input = document.getElementById(inputId);
    const table = document.getElementById(tableId);
    const button = document.getElementById(buttonId);
    const useDashesCheckbox = document.getElementById(checkboxId);

    button.addEventListener('click', () => {
      const tbody = table.querySelector('tbody');
      tbody.innerHTML = ''; // Clear old output

      const lines = input.value.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      const useDashes = useDashesCheckbox.checked;

      lines.forEach(line => {
        const parsed = isbn.parse(line);
        let isbn10 = '', isbn13 = '', isValid = 'No', group = '', publisher = '';

        if (parsed && parsed.isValid) {
          isValid = 'Yes';
          isbn10 = useDashes ? parsed.asIsbn10h() : parsed.asIsbn10();
          isbn13 = useDashes ? parsed.asIsbn13h() : parsed.asIsbn13();
          group = parsed.groupname || '';
          publisher = parsed.publisher || '';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${line}</td>
          <td>${isbn10 || '–'}</td>
          <td>${isbn13 || '–'}</td>
          <td>${isValid}</td>
          <td>${group || '–'}</td>
          <td>${publisher || '–'}</td>
        `;
        tbody.appendChild(row);
      });
    });
  }


