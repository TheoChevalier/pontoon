from django.conf.urls import url

from pontoon.projects import views as projects_views
from pontoon.teams import views as teams_views

import views

urlpatterns = [
    # Localization page
    url(r'^(?P<code>[A-Za-z0-9\-\@\.]+)/(?P<slug>[\w-]+)/$',
        views.localization,
        name='pontoon.localizations.localization'),

    # Project info
    url(r'^(?P<code>[A-Za-z0-9\-\@\.]+)/(?P<slug>[\w-]+)/project-info/$',
        views.localization,
        name='pontoon.localizations.project-info'),

    # Team info
    url(r'^(?P<code>[A-Za-z0-9\-\@\.]+)/(?P<slug>[\w-]+)/team-info/$',
        views.localization,
        name='pontoon.localizations.team-info'),

    # AJAX view: Localization resources
    url(r'^(?P<code>[A-Za-z0-9\-\@\.]+)/(?P<slug>[\w-]+)/ajax/$',
        views.ajax_resources,
        name='pontoon.localizations.ajax.resources'),

    # AJAX view: Project info
    url(r'^[A-Za-z0-9\-\@\.]+/(?P<slug>[\w-]+)/ajax/project-info/$',
        projects_views.ajax_info,
        name='pontoon.localizations.ajax.project-info'),

    # AJAX view: Team info
    url(r'^(?P<locale>[A-Za-z0-9\-\@\.]+)/[\w-]+/ajax/team-info/$',
        teams_views.ajax_info,
        name='pontoon.localizations.ajax.team-info'),
]
