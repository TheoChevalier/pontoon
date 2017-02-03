/*
 * Manage tab content as single-page application
 */
$(function() {
  var urlSplit = $('#server').data('url-split'),
      container = $('#main .container'),
      inProgress = false;

  // Page load
  loadTabContent(window.location.pathname + window.location.search);

  // History
  window.onpopstate = function(event) {
    loadTabContent(window.location.pathname + window.location.search);
  };

  // Menu
  $('body').on('click', '#middle .links a, #main .contributors .links a', function(e) {
    // Keep default middle-, control- and command-click behaviour (open in new tab)
    if (e.which === 2 || e.metaKey || e.ctrlKey) {
      return;
    }

    e.preventDefault();

    var url = $(this).attr('href');
    loadTabContent(url);
    window.history.pushState({}, '', url);
  });

  function showTabMessage(text) {
    var message = $('<p>', {
          class: 'no-results',
          html: text
        });

    container.empty().append(message);
  }

  function updateTabCount(tab, count) {
    tab.find('span').remove();
    if (count > 0) {
      $('<span>', {
        class: 'count',
        html: count
      }).appendTo(tab);
    }
  }

  function loadTabContent(path) {
    if (inProgress) {
      inProgress.abort();
    }

    var url = path.split(urlSplit)[1],
        tab = $('#middle .links a[href="' + path.split('?')[0] + '"]');

    // Update menu
    $('#middle .links li').removeClass('active');
    tab.parents('li').addClass('active');

    if (url !== '/bugs/') {
      inProgress = $.ajax({
        url: '/' + urlSplit + '/ajax' + url,
        success: function(data) {
          container.empty().append(data);

          if (url.startsWith('/contributors/')) {
            var count = $('table > tbody > tr').length;
            updateTabCount(tab, count);
          }

          if (url === '/') {
            $('.controls input').focus();
          }
        },
        error: function(error) {
          if (error.status === 0 && error.statusText !== "abort") {
            showTabMessage('Oops, something went wrong.');
          }
        }
      });

    } else {
      var locale = $('#server').data('locale');
      inProgress = $.ajax({
        url: 'https://bugzilla.mozilla.org/rest/bug',
        data: {
          'field0-0-0': 'component',
          'type0-0-0': 'regexp',
          'value0-0-0': '^' + locale + ' / ',
          'field0-0-1': 'cf_locale',
          'type0-0-1': 'regexp',
          'value0-0-1': '^' + locale + ' / ',
          'resolution': '---',
          'include_fields': 'id,summary,creation_time,last_change_time'
        },
        success: function(data) {
          if (data.bugs.length) {
            data.bugs.sort(function(l, r) {
              return l.last_change_time < r.last_change_time ? 1 : -1;
            });

            var tbody = $('<tbody>'),
                formatter = new Intl.DateTimeFormat('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                });

            $.each(data.bugs, function(i, bug) {
              tr = $('<tr>', {
                title: bug.summary
              });

              $('<td>', {
                class: 'id',
                html: '<a href="https://bugzilla.mozilla.org/show_bug.cgi?id=' + bug.id + '">' + bug.id + '</a>'
              }).appendTo(tr);

              $('<td>', {
                class: 'summary',
                html: bug.summary
              }).appendTo(tr);

              $('<td>', {
                class: 'last-changed',
                html: formatter.format(new Date(bug.last_change_time))
              }).appendTo(tr);

              $('<td>', {
                class: 'date-created',
                html: formatter.format(new Date(bug.creation_time))
              }).appendTo(tr);

              tbody.append(tr);
            });

            var table = $('<table>', {
              class: 'buglist striped',
              html: '<thead>' +
                '<tr>' +
                  '<th class="id">ID</th>' +
                  '<th class="summary">Summary</th>' +
                  '<th class="last-changed">Last Changed</th>' +
                  '<th class="date-created">Date Created</th>' +
                '</tr>' +
              '</thead>'
            }).append(tbody);

            container.empty().append(table.show());

            var count = data.bugs.length;
            updateTabCount(tab, count);

          } else {
            showTabMessage('Zarro Boogs Found.');
          }
        },
        error: function(error) {
          if (error.status === 0 && error.statusText !== "abort") {
            showTabMessage('Oops, something went wrong. We were unable to load the bugs. Please try again later.');
          }
        }
      });
    }
  }
});
