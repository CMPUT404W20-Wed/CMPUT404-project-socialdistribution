from django.core import serializers
from django.http import HttpResponse, JsonResponse
from rest_framework.renderers import JSONRenderer
from .serializers import PostSerializer, CommentSerializer, UserSerializer
from django.shortcuts import render, redirect
from .forms import UserForm
from .models import User, Post, Comment, Friend
from .filters import apply_filter
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
        # Filter posts by PUBLIC, PRIVATE, FRIENDS, or FOAF
        posts = apply_filter(request, "PUBLIC")

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
        post = Post.objects.create(**post)
        response_body = JSONRenderer().render({
            "query": "posts",
            "success": True,
            "message": "Post Created",
            "post": PostSerializer(post).data
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
        # TODO: Filter posts properly
        posts = apply_filter(request, "PUBLIC")

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
        response_body = JSONRenderer().render({
            "query": "getPost",
            "post": PostSerializer(post).data
        })
        return HttpResponse(content=response_body, content_type="application/json", status=200)
    elif method == "DELETE":
        post = Post.objects.get(pk=pid)
        if post.author.id == request.user.pk:
            post.delete()
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    elif method == "PUT":
        post = Post.object.get(pk=pid)
        if post.author.id == request.user.pk:
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
    # TODO: Implement a response for when the user already exists with the same name
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
            # We probably want to include more in the response than just status code
            return HttpResponse(status=401)

# Query for FOAF
# author/<uuid:aid>/friends/
def friends_by_aid(request, aid):
    method = request.method
    # Get the friends of the author
    if method == "GET":
        author_friends = Friend.objects.filter(user1=aid)
        friend_list = []
        for a in author_friends:
            friend_profile = User.objects.get(id=a.user2)
            friend_list.append(friend_profile.host+'/author/'+a.user2)
        # authors_json = serializers.serialize("json", author_friends)
        response_body = JSONRenderer().render({
            "query": "friends",
            "authors": friend_list,
            "count": len(author_friends)
        })
        return HttpResponse(content=response_body, content_type="application/json", status=200)
    # Check if anyone in the list is friends with the author
    if method == "POST":
        body = json.loads(request.body)
        # List of authors we are checking against
        author_list = body["authors"]
        author_profile = User.objects.get(id=aid)
        friend_list = []
        for a in author_list:
            # friend_profile = User.objects.get(id=a.split('/')[-1])
            friendship = Friend.objects.filter(user1=aid, user2=a.split('/')[-1]) and Friend.objects.filter(user2=aid, user1=a.split('/')[-1])
            if friendship:
                friend_list.append(a)
        response_body = JSONRenderer().render({
            "query": "friends",
            "author": author_profile.host+"/author/"+str(aid),
            "authors": friend_list
        })
        return HttpResponse(content=response_body, content_type="application/json", status=200)
    else:
        return HttpResponse(status=405, content="Method Not Allowed")

# author/<authorid>/friends/<authorid2>/
def friendship_by_aid(request, aid1, aid2):
    method = request.method
    if method == "GET":
        friendship = Friend.objects.filter(user1=aid1, user2=aid2) and Friend.objects.filter(user2=aid1, user1=aid2)
        if not friendship:
            # TODO: Return the author list with the stripped protocol
            user1_profile = User.objects.get(id=aid1)
            user2_profile = User.objects.get(id=aid2)
            response_body = JSONRenderer().render({
                "query": "friends",
                "friends": "false",
                "authors": [
                    user1_profile.host+"/author/"+str(aid1),
                    user2_profile.host+"/author/"+str(aid2)
                ]
            })
        else:
            # TODO: Return the author list with the stripped protocol
            user1_profile = User.objects.get(id=aid1)
            user2_profile = User.objects.get(id=aid2)
            response_body = JSONRenderer().render({
                "query": "friends",
                "friends":"true",
                "authors": [
                    user1_profile.host+"/author/"+str(aid1),
                    user2_profile.host+"/author/"+str(aid2)
                ]
            })
        return HttpResponse(content=response_body, content_type="application/json", status=200)
    else:
        return HttpResponse(status=405, content="Method Not Allowed")

def friendrequest(request):
    method = request.method
    if method == "POST":
        body = json.loads(request.body)
        if body["query"] == "friendrequest":
            requester_id = body["author"]["id"].split('/')[-1]
            requestee_id = body["friend"]["id"].split('/')[-1]
            request = {
                "user1": requester_id,
                "user2": requestee_id,
            }
            Friend.objects.create(**request)
            return HttpResponse(status=200)

        else:
            return HttpResponse(status=400, content="Bad Request")
    else:
        return HttpResponse(status=405, content="Method Not Allowed")

def followers(request, aid):
    method = request.method
    if method == "GET":
        friends = Friend.objects.filter(user2=aid)

        authors = []
        for friend in friends:
            authors.append(str(friend.user1))

        response_body = JSONRenderer().render({
            "query": "followers",
            "authors": authors
        })
        return HttpResponse(content=response_body, content_type="application/json", status=200)
    else:
        return HttpResponse(status=405, content="Method Not Allowed")

def following(request, aid):
    method = request.method
    if method == "GET":
        friends = Friend.objects.filter(user1=aid)

        authors = []
        for friend in friends:
            authors.append(str(friend.user2))

        response_body = JSONRenderer().render({
            "query": "following",
            "authors": authors
        })
        return HttpResponse(content=response_body, content_type="application/json", status=200)
    else:
        return HttpResponse(status=405, content="Method Not Allowed")

# Returns a specified profile
# author/<uuid:userid>/
def profile(request, userid):
    method = request.method
    if method == "GET":
        # Get the user object
        user = User.objects.get(pk=userid)
        username = user.username
        host = user.host
        url = host + "/author/" + str(user.id)
        
        friends = Friend.objects.filter(user1=userid)
        friends_list = []
        for friend in friends:
            # Put each friend in json format
            friends_list.append({
                # "id": "TODO",
                # "host": "TODO",
                # "displayName": "TODO",
                # "url": "TODO"
            })


        response_body = JSONRenderer().render({
            "id":"TODO",
            "host":host,
            "displayName": username,
            "url": url,
            "friends": friends_list
        })
        return HttpResponse(content=response_body, content_type="application/json", status=200)
    else:
        return HttpResponse(status=405, content="Method Not Allowed")
