from django.test import TestCase, Client
from django.core import serializers
from .models import Post, User
from unittest import skip
import json

"""
# not a real test case, just figuring out the deserialization business
class DeserializationTests(TestCase):
    def setUp(self):
        self.user = User()
        self.user.save()
        post = {
            "author": str(self.user.id),
            "title": "whatever",
            "description": "test post",
            "content": "lol"
        }
        self.post = json.dumps(post)
    
    def test_serialize(self):
        post = json.loads(self.post)
        post["author"] = User.objects.get(pk=post["author"])
        Post.objects.create(**post)
"""

# these will only work while endpoints are not checking auth!!!
class EndpointTests(TestCase):
    def setUp(self):
        self.c = Client()
        self.user1 = User(username='1')
        self.user2 = User(username='2')
        self.user1.save()
        self.user2.save()
    
    @skip("update this")
    def test_create_and_get_post(self):
        post = {
            "author": str(self.user1.id),
            "title": "1",
            "description": "2",
            "content": "3"
        }
        response = self.c.post("/posts/", post, content_type="application/json")
        assert(response.status_code == 204)
        # TODO: retrieve by id
    
    @skip("update this")
    def test_get_all_posts(self):
        post = {
            "author": str(self.user1.id),
            "title": "1",
            "description": "2",
            "content": "3"
        }
        # post the same post twice, it will have different ids though
        self.c.post('/posts/', post, content_type="application/json")
        self.c.post('/posts/', post, content_type="application/json")
        response = self.c.get('/posts/')
        assert(len(response.json()) == 2)