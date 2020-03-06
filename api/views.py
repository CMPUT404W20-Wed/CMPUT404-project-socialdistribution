from django.core import serializers
from django.http import HttpResponse
from django.shortcuts import render
from .models import User, Post, Comment

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
        return HttpReponse(status=204)
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