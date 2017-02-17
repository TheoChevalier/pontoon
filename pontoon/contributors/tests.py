from collections import OrderedDict
from datetime import (
    datetime,
    timedelta,
)
from mock import patch
from random import randint

from django.http import HttpResponse
from django.utils.timezone import now, make_aware
from django_nose.tools import (
    assert_equal,
    assert_true,
    assert_code,
)

from pontoon.base.tests import (
    ProjectFactory,
    TranslationFactory,
    TestCase,
    UserFactory,
)
from pontoon.base.tests.test_views import UserTestCase
from pontoon.base.utils import aware_datetime
from pontoon.contributors import views


class ContributorProfileViewTests(UserTestCase):
    def setUp(self):
        super(ContributorProfileViewTests, self).setUp()

        mock_render = patch('pontoon.contributors.views.render', return_value=HttpResponse(''))
        self.mock_render = mock_render.start()
        self.addCleanup(mock_render.stop)

    def test_contributor_profile_by_username(self):
        """Users should be able to retrieve contributor's profile by its username."""
        self.client.get('/contributors/{}/'.format(self.user.username))

        assert_equal(self.mock_render.call_args[0][2]['contributor'], self.user)

    def test_contributor_profile_by_email(self):
        """Check if we can access contributor profile by its email."""
        self.client.get('/contributors/{}/'.format(self.user.email))

        assert_equal(self.mock_render.call_args[0][2]['contributor'], self.user)

    def test_logged_user_profile(self):
        """Logged user should be able to re"""
        self.client.get('/profile/')

        assert_equal(self.mock_render.call_args[0][2]['contributor'], self.user)

    def test_unlogged_user_profile(self):
        """Unlogged users shouldn't have access to edit any profile."""
        self.client.logout()

        assert_equal(self.client.get('/profile/')['Location'], '/403')


class ContributorTimelineViewTests(UserTestCase):
    """User timeline is a list of events created by a certain contributor."""
    def setUp(self):
        """
        We setup a sample contributor with random set of translations.
        """
        super(ContributorTimelineViewTests, self).setUp()
        self.project = ProjectFactory.create()
        self.translations = OrderedDict()

        for i in xrange(26):
            date = make_aware(datetime(2016, 12, 1) - timedelta(days=i))
            translations_count = randint(1,3)
            self.translations.setdefault((date, translations_count), []).append(
                TranslationFactory.create_batch(translations_count,
                    date=date,
                    user=self.user,
                    entity__resource__project=self.project,
                )
            )

        mock_render = patch('pontoon.contributors.views.render', return_value=HttpResponse(''))
        self.mock_render = mock_render.start()
        self.addCleanup(mock_render.stop)

    def test_timeline(self):
        """Backend should return events filtered by page number requested by user."""
        self.client.get('/contributors/{}/timeline/?page=2'.format(self.user.username))

        assert_equal(
            self.mock_render.call_args[0][2]['events'],
            [{
                'date': dt,
                'type': 'translation',
                'count': count,
                'project': self.project,
                'translation': translations[0][0],
            } for (dt,count), translations in self.translations.items()[10:20]
        ])

    def test_timeline_invalid_page(self):
        """Backend should return 404 error when user requests an invalid/empty page."""
        resp = self.client.get('/contributors/{}/timeline/?page=45'.format(self.user.username))
        assert_code(resp, 404)

        resp = self.client.get('/contributors/{}/timeline/?page=-aa45'.format(self.user.username))
        assert_code(resp, 404)

    def test_non_active_contributor(self):
        """Test if backend is able return events for a user without contributions."""
        nonactive_contributor = UserFactory.create()
        self.client.get('/contributors/{}/timeline/'.format(nonactive_contributor.username))
        assert_equal(
            self.mock_render.call_args[0][2]['events'], [
            {
                'date': nonactive_contributor.date_joined,
                'type': 'join'
            }
        ])

    def test_timeline_join(self):
        """Last page of results should include informations about the when user joined pontoon."""
        self.client.get('/contributors/{}/timeline/?page=3'.format(self.user.username))

        assert_equal(self.mock_render.call_args[0][2]['events'][-1], {
            'date': self.user.date_joined,
            'type': 'join'
        })


class ContributorsTests(TestCase):
    def setUp(self):
        mock_render = patch.object(views.ContributorsView, 'render_to_response', return_value=HttpResponse(''))
        self.mock_render = mock_render.start()
        self.addCleanup(mock_render.stop)

        mock_translations_manager = patch('pontoon.base.models.UserTranslationsManager.with_translation_counts')
        self.mock_translations_manager = mock_translations_manager.start()
        self.addCleanup(mock_translations_manager.stop)

    def test_default_period(self):
        """
        Calling the top contributors should result in period being None.
        """
        self.client.get('/contributors/')
        assert_true(self.mock_render.call_args[0][0]['period'] is None)
        assert_true(self.mock_translations_manager.call_args[0][0] is None)

    def test_invalid_period(self):
        """
        Checks how view handles invalid period, it result in period being None - displays all data.  """
        # If period parameter is invalid value
        self.client.get('/contributors/?period=invalidperiod')
        assert_true(self.mock_render.call_args[0][0]['period'] is None)
        assert_true(self.mock_translations_manager.call_args[0][0] is None)

        # Period shouldn't be negative integer
        self.client.get('/contributors/?period=-6')
        assert_true(self.mock_render.call_args[0][0]['period'] is None)
        assert_true(self.mock_translations_manager.call_args[0][0] is None)

    def test_given_period(self):
        """
        Checks if view sets and returns data for right period.
        """
        with patch('django.utils.timezone.now', wraps=now, return_value=aware_datetime(2015, 7, 5)):
            self.client.get('/contributors/?period=6')
            assert_equal(self.mock_render.call_args[0][0]['period'], 6)
            assert_equal(self.mock_translations_manager.call_args[0][0], aware_datetime(2015, 1, 5))
