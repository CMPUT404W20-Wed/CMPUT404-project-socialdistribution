from django.core import serializers
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from .forms import UserForm
from .models import User, Post, Comment, Friends
import json

# TODO: serializers should only spit out certain fields (per example-article.json), ez but tedious
# TODO: probably should return some status code indicating wrong method instead of pass, other errors

# author/posts
def posts_visible(request):
    method = request.method
    if method == "GET":
        # TODO: posts visible to the currently authenticated user
        posts = Post.objects.all()
        posts_json = serializers.serialize("json", posts)
        return HttpResponse(content=posts_json, content_type="application/json", status=200)
    pass

# posts by author id
# author/<uuid:aid>/posts
def posts_by_aid(request, aid):
    if method == "GET":
        # all posts made by author id aid visible to currently authed user
        # TODO: this thing here ignores the visibility thing
        user = User.objects.get(pk=aid)
        posts = Post.objects.filter(author=user)
        posts_json = serializers.serialize(posts)
        return HttpResponse(content=posts_json, status=200)
    pass

# posts/
def all_posts(request):
    method = request.method
    if method == "GET":
        # TODO: only visible posts or something
        posts = Post.objects.all()
        posts_json = serializers.serialize("json", posts)
        return HttpResponse(content=posts_json, content_type="application/json", status=200)
    if method == "POST":
        # create a post with some id
        post = json.loads(request.body)
        post["author"] = User.objects.get(pk=post["author"])
        Post.objects.create(**post)
        return HttpResponse(status=204)
    pass

# posts by post id
# posts/<uuid:pid>
def posts_by_pid(request, pid):
    method = request.method
    if method == "GET":
        post = Post.objects.get(pk=pid)
        post_json = serializers.serialize("json", post)
        return HttpResponse(content=post_json, status=200)
    pass

# comments by post id
# posts/<uuid:pid>/comments
def comments_by_pid(request, pid):
    method = request.method
    if method == "GET":
        post = Post.object.get(pk=pid)
        comments = Comment.objects.filter(post=post)
        comments_json = serializers.serialize("json", comments)
        return HttpResponse(content=posts_json, content_type="application/json", status=200)
    if method == "POST":
        comment = json.loads(request.body)
        comment["author"] = User.objects.get(pk=comment["author"]) # TODO: should actually be authed user (?)
        comment["post"] = Post.object.get(pk=pid)
        Comment.objects.create(**comment)
        return HttpResponse(status=204)
    pass

# TODO: render() the front get if its a get
def register(request):
    method = request.method
    if method == "POST":
        form = UserForm(request.POST)
        if form.is_valid():
            user = form.save()
            # TODO: check wtf this does
            # user.set_password(user.password)
            user.save()
    pass

# referenced login from https://medium.com/@himanshuxd/how-to-create-registration-login-webapp-with-django-2-0-fd33dc7a6c67
def login(request):
    method = request.method
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(username=username, password=password)
        if user:
            # TODO: serve up some home page - which page?
            pass
        else:
            # TODO: serve some other page - which page?
            pass

# Query for FOAF
# author/<uuid:aid>/friends
def friends_by_aid(request, aid):
    method = request.method
    # Get the friends of the author
    if method == "GET":
        authors = Friends.objects.filter(user1=aid)
        authors_json = serializers.serialize("json", authors)
        return HttpResponse(content=authors_json, content_type="application/json", status=200)
    # Check if anyone in the list is friends with the author
    if method == "POST":
        # TODO: Still need to implement, probably save for Part 2
        pass
    pass

def friendship_by_aid(request, aid1, aid2):
    method = request.method
    if method == "GET":
        friendship = Friends.objects.filter(user1=aid1, user2=aid2) and Friends.objects.filter(user2=aid1, user1=aid2)
        if not friendship:
            # TODO: Return the author list with the stripped protocol
            return JsonResponse({"friends":"false"})
        else:
            # TODO: Return the author list with the stripped protocol
            return JsonResponse({"friends":"true"})
    pass