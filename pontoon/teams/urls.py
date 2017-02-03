from django.conf.urls import url
from django.views.generic import RedirectView

import views

urlpatterns = [
    # Localization teams
    url(r'^teams/$',
        views.teams,
        name='pontoon.teams'),

    # Redirect to a team page
    url(r'^teams/(?P<locale>[A-Za-z0-9\-\@\.]+)/$',
        RedirectView.as_view(url="/%(locale)s/", permanent=True)),

    # Team contributors
    url(r'^(?P<locale>[A-Za-z0-9\-\@\.]+)/contributors/$',
        views.team,
        name='pontoon.teams.contributors'),

    # Team bugs
    url(r'^(?P<locale>[A-Za-z0-9\-\@\.]+)/bugs/$',
        views.team,
        name='pontoon.teams.bugs'),

    # Team info
    url(r'^(?P<locale>[A-Za-z0-9\-\@\.]+)/info/$',
        views.team,
        name='pontoon.teams.info'),

    # Team permissions
    url(r'^(?P<locale>[A-Za-z0-9\-\@\.]+)/permissions/$',
        views.team,
        name='pontoon.teams.permissions'),

    # Legacy url for permissions management
    url(r'^(?P<locale>[A-Za-z0-9\-\@\.]+)/manage/$',
        RedirectView.as_view(url='/%(locale)s/permissions/', permanent=True),
        name='pontoon.teams.manage'),

    # AJAX view: Team projects
    url(r'^(?P<locale>[A-Za-z0-9\-\@\.]+)/ajax/$',
        views.ajax_projects,
        name='pontoon.teams.ajax.projects'),

    # AJAX view: Team contributors
    url(r'^(?P<code>[A-Za-z0-9\-\@\.]+)/ajax/contributors/$',
        views.LocaleContributorsView.as_view(),
        name='pontoon.teams.ajax.contributors'),

    # AJAX view: Team info
    url(r'^(?P<locale>[A-Za-z0-9\-\@\.]+)/ajax/info/$',
        views.ajax_info,
        name='pontoon.teams.ajax.info'),

    # AJAX view: Team permissions
    url(r'^(?P<locale>[A-Za-z0-9\-\@\.]+)/ajax/permissions/$',
        views.ajax_permissions,
        name='pontoon.teams.ajax.permissions'),

    # AJAX: Request projects to be added to locale
    url(r'^teams/(?P<locale>[A-Za-z0-9\-\@\.]+)/request/$',
        views.request_projects,
        name='pontoon.locale.request'),
]
