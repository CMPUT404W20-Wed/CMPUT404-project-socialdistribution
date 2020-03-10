from django.test import TestCase, Client
from django.core import serializers
from .models import Post, User, Comment
from unittest import skip
import json
from .serializers import *
from rest_framework.renderers import JSONRenderer


class SerializerTests(TestCase):
    
    @skip("just an example how to use the serializers now, remove me later")
    def test_post(self):
        user1 = User(username='1', github="http://www.github.com/1")
        user1.save()
        post_object = Post(author=user1, title="1", description="2", content="3")
        post_serialized = PostSerializer(post_object)
        print(JSONRenderer().render(post_serialized.data))
        post_serialized = PostSerializer([post_object], many=True)
        print(JSONRenderer().render(post_serialized.data))
        

# these will only work while endpoints are not checking auth!!!
class EndpointTests(TestCase):
    def setUp(self):
        self.c = Client()
        self.user1 = User(username='1')
        self.user2 = User(username='2')
        self.user1.save()
        self.user2.save()
        
        self.post1 = Post(title='a', description='b', content='c', author=self.user1)
        self.post1.save()
        self.comment1 = Comment(comment='d', author=self.user1, post=self.post1)
        self.comment1.save()
    
    def test_get_posts_visible(self):
        response = self.c.get("/api/author/posts/")
    
    def test_get_posts_author_id(self):
        response = self.c.get("/api/author/{}/posts/".format(self.user1.id))
