from __future__ import unicode_literals

from reviewboard import (get_manual_url, get_package_version,
                         get_version_string, is_release, VERSION)
from reviewboard.admin.read_only import is_site_read_only_for


def read_only(request):
    """Return a dictionary with the read-only state.

    Args:
        request (django.http.HttpRequest):
            The current HTTP request.

    Returns:
        dict:
        State to add to the context.
    """
    return {
        'is_read_only': is_site_read_only_for(request.user),
    }


def version(request):
    """Return a dictionary with version information.

    Args:
        request (django.http.HttpRequest):
            The current HTTP request.

    Returns:
        dict:
        State to add to the context.
    """
    return {
        'version': get_version_string(),
        'package_version': get_package_version(),
        'is_release': is_release(),
        'version_raw': VERSION,
        'RB_MANUAL_URL': get_manual_url(),
    }
