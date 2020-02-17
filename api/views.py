from django.shortcuts import render
from .models import User, Post, Comment

def posts_visible(request):
    pass

# posts by author id
def posts_by_aid(request, aid):
    pass

def get_all_posts(request):
    pass

# posts by post id
def posts_by_pid(request, pid):
    pass

# comments by post id
def comments_by_pid(request, pid):
    pass