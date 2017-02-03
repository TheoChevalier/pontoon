/* Must be available immediately */
// Add case insensitive :contains-like selector to jQuery (search & filter)
$.expr[':'].containsi = function(a, i, m) {
  return (a.textContent || a.innerText || '')
    .toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};


/* Public functions used across different files */
var Pontoon = (function (my) {
  return $.extend(true, my, {
    table: {

      /*
       * Filter table
       *
       * TODO: remove old search code from main.js
       */
      filter: function () {
        $('body').on('input.filter', 'input.table-filter', function(e) {
          if (e.which === 9) {
            return;
          }

              // Filter input field
          var field = $(this),
              // Selector of the element containing a list of items to filter
              list = $(this).data('list') || '.table-sort tbody',
              // Selector of the list item element, relative to list
              item = $(this).data('item') || 'tr',
              // Optional selector to match filter query against
              filter = $(this).data('filter') || ' td:first-child';

          $(list)
            .find(item + '.limited').show().end()
            .find(item + '.limited' + filter + ':not(":containsi(\'' + $(field).val() + '\')")').parents(item).hide();
        });
      }(),

      /*
       * Sort table
       */
      sort: function() {
        $('body').on('click', 'table.table-sort th', function (e) {
          function getProgress(el) {
            var legend = $(el).find('.progress .legend'),
                all = legend.find('.all .value').data('value') || 0,
                translated = legend.find('.translated .value').data('value') / all || 0,
                suggested = legend.find('.suggested .value').data('value') / all || 0;

            return {
              'translated': translated,
              'suggested': suggested
            };
          }

          function getDate(el) {
            var date = $(el).find('td:eq(' + index + ')').find('time').attr('datetime') || 0;
            return new Date(date);
          }

          function getPriority(el) {
            return $(el).find('.priority .fa-star.active').length;
          }

          function getEnabled(el) {
            return $(el).find('.check.enabled').length;
          }

          function getNumber(el) {
            return parseInt($(el).find('span').text().replace(/,/g, ''));
          }

          function getString(el) {
            return $(el).find('td:eq(' + index + ')').text();
          }

          var node = $(this),
              index = node.index(),
              table = node.parents('.table-sort'),
              list = table.find('tbody'),
              items = list.find('tr'),
              dir = node.hasClass('asc') ? -1 : 1,
              cls = node.hasClass('asc') ? 'desc' : 'asc';

          $(table).find('th').removeClass('asc desc');
          node.addClass(cls);

          items.sort(function(a, b) {
            // Sort by translated, then by suggested percentage
            if (node.is('.progress')) {
              var chartA = getProgress(a),
                  chartB = getProgress(b);

              return (chartA.translated - chartB.translated) * dir ||
                (chartA.suggested - chartB.suggested) * dir;

            // Sort by date
            } else if (node.is('.deadline') || node.is('.latest-activity')) {
              return (getDate(b) - getDate(a)) * dir;

            // Sort by priority
            } else if (node.is('.priority')) {
              return (getPriority(b) - getPriority(a)) * dir;

            // Sort by enabled state
            } else if (node.is('.check')) {
              return (getEnabled(b) - getEnabled(a)) * dir;

            // Sort by enabled state
            } else if (node.is('.population')) {
              return (getNumber(b) - getNumber(a)) * dir;

            // Sort by alphabetical order
            } else {
              return getString(a).localeCompare(getString(b)) * dir;
            }
          });

          list.append(items);
        });
      }()
    }
  });
}(Pontoon || {}));
