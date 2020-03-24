from django.contrib import admin
from .models import User, Post, Comment, Friend, LocalLogin, RemoteLogin

# Register your models here.
admin.site.register(User)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Friend)
admin.site.register(RemoteLogin)
admin.site.register(LocalLogin)
