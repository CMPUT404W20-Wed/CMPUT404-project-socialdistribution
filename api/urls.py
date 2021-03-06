"""social_backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.http import HttpResponseNotFound
from django.urls import include, path, re_path
from django.contrib.auth import login
from django.urls import include, path, re_path
from . import views

from django.http import HttpResponseNotFound

#Before adding url, make sure it's not being used by React, in social_frontend/App.js
urlpatterns = [
    path('', views.index),
    path('media/<uuid:pid>.<str:format_>', views.media),
    path('media-redirect/<path:url>', views.media_redir),
    path('user-search', views.user_search),
    path('author/posts/', views.posts_visible),
    path('author/<uuid:aid>/posts/', views.posts_by_aid),
    path('posts/', views.all_posts),
    path('posts/<uuid:pid>/', views.posts_by_pid),
    path('posts/<uuid:pid>/comments/', views.comments_by_pid),
    path('posts/<uuid:pid>/comments/<uuid:cid>', views.comments_by_cid),
    path('register/', views.register),
    path('login/', views.login),
    path('logout/', views.logout),
    path('author/<uuid:aid>/', views.profile),
    path('author/<uuid:aid>/friends/', views.friends_by_aid),
    path('author/<uuid:aid1>/friends/<uuid:aid2>/', views.friendship_by_aid),
    path('author/<uuid:aid>/followers/', views.followers),
    path('author/<uuid:aid>/following/', views.following),
    path('author/<uuid:aid>/github/', views.github_post),
    path('friendrequest/', views.friendrequest),
    re_path(r'.*', lambda req: HttpResponseNotFound()),
]
