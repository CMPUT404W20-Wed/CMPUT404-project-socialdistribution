import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models

# TODO: need validators (some fields required) https://docs.djangoproject.com/en/3.0/ref/validators/
# TODO: some fields should not be settable by user

# extend the User object to get the extra fields, example #4 here:
# https://simpleisbetterthancomplex.com/tutorial/2016/07/22/how-to-extend-django-user-model.html
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    approved = models.BooleanField(default=False)
    host = models.URLField(max_length=255)
    # these are not in the spec
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    # don't need this because this class inherits username
    # displayName = models.CharField(max_length=20)
    github = models.URLField(max_length=255)


class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    source = models.URLField(max_length=255) # where did you get this post from?
    origin = models.URLField(max_length=255) # where is it actually from
    # The content type of the post, assume either
    # text/markdown, text/plain, application/base64
    # These are embedded png or jpeg -- might need to make two posts for images
    # image/png;base64, image/jpeg;base64
    # for HTML you will want to strip tags before displaying
    contentType = models.CharField(max_length=18)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    published = models.DateTimeField(auto_now_add=True)
    # this one is not in the spec
    updated = models.DateTimeField(auto_now=True)
    
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    content = models.CharField(max_length=1023) # what is a good max length?
    # for visibility PUBLIC means it is open to the wild web
    # FOAF means it is only visible to Friends of A Friend
    # If any of my friends are your friends I can see the post
    # FRIENDS means if we're direct friends I can see the post
    # PRIVATE means only you can see the post
    # SERVERONLY means only those on your (home) server can see the post
    # PRIVATE means only authors listed in "visibleTo" can see the post
    VISIBILITY_CHOICES = [
        ("PUBLIC", "PUBLIC"),
        ("FOAF", "FOAF"),
        ("FRIENDS", "FRIENDS"),
        ("PRIVATE", "PRIVATE"),
        ("SERVERONLY", "SERVERONLY"),
    ]
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default="PUBLIC")
    #"visibleTo":[], # list of author URIs who can read the PRIVATE message
    # categories this post fits into (a list of strings)
    #"categories":["web","tutorial"],
    # unlisted means it is public if you know the post name
    # use this for images, it's so images don't show up in timelines
    unlisted = models.BooleanField(default=False)
    
    def get_comments(self):
        # return Comment.objects.filter(id=self.id)
        return Comment.objects.filter(post=self.id)
    
    class Meta:
        ordering = ['-published']


class Comment(models.Model):
    # ID of the Comment (UUID)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    
    comment = models.CharField(max_length=255)
    # TODO: comments will always be text/markdown? what to do on front end?
    contentType = models.CharField(max_length=18, default="text/plain")
    # these two are not in the spec
    published = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['published']
    

class Friend(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user1 = models.CharField(max_length=40)
    user2 = models.CharField(max_length=40)

class Node(models.Model):
    # host = models.URLField(max_length=255, primary_key=True)
    username = models.CharField(max_length=40, primary_key=True)
    password = models.CharField(max_length=40)

    # # Not sure if this has to be a variable or if it can stay a function
    # def get_username(self):
    #     # Username is currently just the host app name
    #     # ie for us it's glacial-earth-37816
    #     return host.strip("https://").split('.')[0]