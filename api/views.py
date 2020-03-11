from django.core import serializers
from django.http import HttpResponse, JsonResponse
from rest_framework.renderers import JSONRenderer
from .serializers import PostSerializer, CommentSerializer, UserSerializer
from django.shortcuts import render, redirect
from .forms import UserForm
from .models import User, Post, Comment, Friend
import json

# TODO: serializers should only spit out certain fields (per example-article.json), ez but tedious

# index
# We may want to change this to a redirect or something along those lines in future
# just making this for now to have an index function
def index(request):
    method = request.method
    if method == "POST":
        users = User.objects.values_list('id')
        return redirect("/posts/")
    else:
        return HttpResponse(status=405, content="Method Not Allowed")

# author/posts
def posts_visible(request):
    method = request.method
    if method == "GET":
        # TODO: posts visible to the currently authenticated user
        posts = Post.objects.all()
        response_body = JSONRenderer().render({
            "query": "posts",
            "count": len(posts),
            "size": len(posts),
            #"next": "TODO",
            #"previous": "TODO",
            "posts": PostSerializer(posts, many=True).data
        })
        return HttpResponse(content=response_body, status=200, content_type="application/json")
    if method == "POST":
        post = json.loads(request.body)
        post["author"] = request.user
        Post.objects.create(**post)
        response_body = JSONRenderer().render({
            "query": "posts",
            "success": True,
            "message": "Post Created"
        })
        return HttpResponse(content=response_body, status=200, content_type="application/json")
    return HttpResponse(status=405, content="Method Not Allowed")

# posts by author id
# author/<uuid:aid>/posts
def posts_by_aid(request, aid):
    method = request.method
    if method == "GET":
        # all posts made by author id aid visible to currently authed user
        # TODO: this thing here ignores the visibility thing
        user = User.objects.get(pk=aid)
        posts = Post.objects.filter(author=user)
        response_body = JSONRenderer().render({
            "query": "posts",
            "count": len(posts),
            "size": len(posts),
            #"next": "TODO",
            #"previous": "TODO",
            "posts": PostSerializer(posts, many=True).data
        })
        return HttpResponse(content=response_body, content_type="application/json", status=200)
    else:
        return HttpResponse(status=405, content="Method Not Allowed")

# posts/
def all_posts(request):
    method = request.method
    if method == "GET":
        # TODO: only visible posts or something
        posts = Post.objects.all()
        response_body = JSONRenderer().render({
            "query": "posts",
            "count": len(posts),
            "size": len(posts),
            #"next": "TODO",
            #"previous": "TODO",
            "posts": PostSerializer(posts, many=True).data
        })
        return HttpResponse(content=response_body, content_type="application/json", status=200)
    else:
        return HttpResponse(status=405, content="Method Not Allowed")

# posts by post id
# posts/<uuid:pid>
def posts_by_pid(request, pid):
    method = request.method
    if method == "GET":
        post = Post.objects.get(pk=pid)
        # TODO: please sanity check that this is actually the response format
        response_body = JSONRenderer().render({
            "query": "posts",
            "count": 1,
            "post": PostSerializer(post).data
        })
        return HttpResponse(content=response_body, content_type="application/json", status=200)
    elif method == "DELETE":
        post = Post.objects.get(pk=pid)
        if post.author == request.user.pk:
            post.delete()
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    elif method == "PUT":
        post = Post.object.get(pk=pid)
        if post.author == request.user.pk:
            post.update(**json.loads(request.body))
            post.save()
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    return HttpResponse(status=405, content="Method Not Allowed")

# comments by post id
# posts/<uuid:pid>/comments
def comments_by_pid(request, pid):
    method = request.method
    if method == "GET":
        post = Post.objects.get(pk=pid)
        comments = Comment.objects.filter(post=post)
        response_body = JSONRenderer().render({
            "query": "comments",
            "count": len(comments),
            "size": len(comments),
            #"next": "TODO",
            #"previous": "TODO",
            "comments": CommentSerializer(comments, many=True).data
        })
        return HttpResponse(content=response_body, content_type="application/json", status=200)
    elif method == "POST":
        comment = json.loads(request.body)
        comment["author"] = request.user
        comment["post"] = Post.objects.get(pk=pid)
        Comment.objects.create(**comment)
        response_body = JSONRenderer().render({
            "query": "addComment",
            "success": True,
            "message": "Comment Added"
        })
        return HttpResponse(content=response_body, content_type="application/json", status=200)
    return HttpResponse(status=405, content="Method Not Allowed")

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
    else:
        return HttpResponse(status=405, content="Method Not Allowed")

# referenced login from https://medium.com/@himanshuxd/how-to-create-registration-login-webapp-with-django-2-0-fd33dc7a6c67
def login(request):
    method = request.method
    if method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(username=username, password=password)
        if user:
            # TODO: serve up some home page - which page?
            redirect("/posts/")
        else:
            # TODO: serve some other page - which page? Login + error message?
            pass

# Query for FOAF
# author/<uuid:aid>/friends
def friends_by_aid(request, aid):
    method = request.method
    # Get the friends of the author
    if method == "GET":
        authors = Friend.objects.filter(user1=aid)
        authors_json = serializers.serialize("json", authors)
        return HttpResponse(content=authors_json, content_type="application/json", status=200)
    # Check if anyone in the list is friends with the author
    if method == "POST":
        # TODO: Still need to implement, probably save for Part 2
        pass
    else:
        return HttpResponse(status=405, content="Method Not Allowed")

def friendship_by_aid(request, aid1, aid2):
    method = request.method
    if method == "GET":
        friendship = Friend.objects.filter(user1=aid1, user2=aid2) and Friend.objects.filter(user2=aid1, user1=aid2)
        if not friendship:
            # TODO: Return the author list with the stripped protocol
            return JsonResponse({
                "query": "friends",
                "friends": "false"
            })
        else:
            # TODO: Return the author list with the stripped protocol
            return JsonResponse({
                "query": "friends",
                "friends":"true",
                "authors": [aid1, aid2]
            })
    else:
        return HttpResponse(status=405, content="Method Not Allowed")

# Returns a specified profile
def profile(request, userid):
    method = request.method
    if method == "GET":
        # Get the user object
        user = User.objects.get(pk=userid)
        username = user.username
        github = user.github
        host = user.host
        return HttpResponse("You're looking at %s's profile" % username)
    else:
        return HttpResponse(status=405, content="Method Not Allowed")