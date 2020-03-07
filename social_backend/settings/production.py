from .common import *

import django_heroku

WSGI_APPLICATION = 'social_backend.wsgi.application'

django_heroku.settings(locals())
