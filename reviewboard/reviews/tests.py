from django.core.exceptions import ValidationError
    @add_fixtures(['test_scmtools'])
    def test_create_with_site(self):
        """Testing ReviewRequest.objects.create with LocalSite"""
        user = User.objects.get(username='doc')
        local_site = LocalSite.objects.create(name='test')
        repository = self.create_repository()

        review_request = ReviewRequest.objects.create(
            user, repository, local_site=local_site)
        self.assertEqual(review_request.repository, repository)
        self.assertEqual(review_request.local_site, local_site)
        self.assertEqual(review_request.local_id, 1)

    @add_fixtures(['test_scmtools'])
    def test_create_with_site_and_commit_id(self):
        """Testing ReviewRequest.objects.create with LocalSite and commit ID"""
        user = User.objects.get(username='doc')
        local_site = LocalSite.objects.create(name='test')
        repository = self.create_repository()

        review_request = ReviewRequest.objects.create(
            user, repository,
            commit_id='123',
            local_site=local_site)
        self.assertEqual(review_request.repository, repository)
        self.assertEqual(review_request.commit_id, '123')
        self.assertEqual(review_request.local_site, local_site)
        self.assertEqual(review_request.local_id, 1)

    @add_fixtures(['test_scmtools'])
    def test_create_with_site_and_commit_id_not_unique(self):
        """Testing ReviewRequest.objects.create with LocalSite and
        commit ID that is not unique
        """
        user = User.objects.get(username='doc')
        local_site = LocalSite.objects.create(name='test')
        repository = self.create_repository()

        # This one should be fine.
        ReviewRequest.objects.create(user, repository, commit_id='123',
                                     local_site=local_site)
        self.assertEqual(local_site.review_requests.count(), 1)

        # This one will yell.
        self.assertRaises(
            ValidationError,
            lambda: ReviewRequest.objects.create(
                user, repository,
                commit_id='123',
                local_site=local_site))

        # Make sure that entry doesn't exist in the database.
        self.assertEqual(local_site.review_requests.count(), 1)

    @add_fixtures(['test_scmtools'])
    def test_create_with_site_and_commit_id_and_fetch_problem(self):
        """Testing ReviewRequest.objects.create with LocalSite and
        commit ID with problem fetching commit details
        """
        user = User.objects.get(username='doc')
        local_site = LocalSite.objects.create(name='test')
        repository = self.create_repository()

        self.assertEqual(local_site.review_requests.count(), 0)

        ReviewRequest.objects.create(
            user, repository,
            commit_id='123',
            local_site=local_site,
            create_from_commit_id=True)

        # Make sure that entry doesn't exist in the database.
        self.assertEqual(local_site.review_requests.count(), 1)
        review_request = local_site.review_requests.get()
        self.assertEqual(review_request.local_id, 1)
        self.assertEqual(review_request.commit_id, '123')

    def _get_context_var(self, response, varname):
    def test_review_detail_redirect_no_slash(self):
        """Testing review_detail view redirecting with no trailing slash"""
    def test_review_detail(self):
        """Testing review_detail view"""
        request = self._get_context_var(response, 'review_request')
    def test_review_detail_context(self):
        """Testing review_detail view's context"""
        request = self._get_context_var(response, 'review_request')
        """Testing review_detail and ordering of diff comments on a review"""
    def test_review_detail_sitewide_login(self):
    def test_new_review_request(self):
        """Testing new_review_request view"""
    def test_interdiff(self):
            print("Error: %s" % self._get_context_var(response, 'error'))
            print(self._get_context_var(response, 'trace'))
            self._get_context_var(response, 'diff_context')['num_diffs'],
        files = self._get_context_var(response, 'files')
    def test_interdiff_new_file(self):
            print("Error: %s" % self._get_context_var(response, 'error'))
            print(self._get_context_var(response, 'trace'))
            self._get_context_var(response, 'diff_context')['num_diffs'],
        files = self._get_context_var(response, 'files')
    def test_draft_changes(self):
        draft = self._get_draft()
    def _get_draft(self):
    def test_duplicate_reviews(self):
    def test_milestones(self):
    def test_palindrome(self):
    def test_unicode(self):