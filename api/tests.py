from django.test import TestCase
from django.core import serializers
from .models import Post, User
import json

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

# TODO: get some once auth goes