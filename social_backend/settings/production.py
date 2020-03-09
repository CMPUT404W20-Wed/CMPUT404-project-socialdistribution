from .common import *

import os

import django_heroku

WSGI_APPLICATION = 'social_backend.wsgi.application'

STATIC_ROOT = os.path.join(BASE_DIR, 'static_root')
if not os.path.exists(STATIC_ROOT): os.mkdir(STATIC_ROOT)

django_heroku.settings(locals())
