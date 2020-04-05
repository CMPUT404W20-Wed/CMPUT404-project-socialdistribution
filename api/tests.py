from django.test import TestCase, Client
from django.core import serializers
from .models import Post, User, Comment, Friend, RemoteLogin, LocalLogin
from unittest import skip
import json
from .serializers import *
from rest_framework.renderers import JSONRenderer
from .utils import *
import requests


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
        self.user1 = User(username='1', approved=True)
        self.user1.set_password('123')
        self.user2 = User(username='2', approved=True)
        self.user2.host = "http://localhost:8000"
        self.user1.save()
        self.user2.save()

        self.user3 = User(username='3', approved=True)
        self.user3.host = "http://localhost:8000"
        self.user3.save()
        
        self.post1 = Post(title='a', description='b', content='c', author=self.user1)
        self.post1.save()
        self.comment1 = Comment(comment='d', author=self.user1, post=self.post1)
        self.comment1.save()

        self.post2 = Post(title='e', description='f', content='g', author=self.user2, visibility="PRIVATE")
        self.post2.save()

        self.friend1 = Friend(user1=self.user1.id, user2=self.user2.id)
        self.friend2 = Friend(user1=self.user2.id, user2=self.user1.id)
        self.friend3 = Friend(user1=self.user1.id, user2=self.user3.id)
        self.friend1.save()
        self.friend2.save()
        self.friend3.save()

        
        # register a user with endpoint good and proper like
        self.c.post('/api/register/', {'username':'user123','password':'12345'}, content_type='application/json')

        # ...need to approve the user
        u = User.objects.get(username='user123')
        u.approved = True
        u.save()

        self.c.login(username='user123', password='12345')
    
    def test_register_login(self):
        client = Client()
        response = client.login(username='user123', password='12345')
        assert(response) # should be true if we were able to login with the user123
    
    def test_post_just_one(self):
        post = {
            "title": "1",
            "description": "2",
            "content": "c"
        }
        response = self.c.post('/api/author/posts/', post, content_type="application/json")
        response_json = response.json()
        assert(response_json['success'] == True)
        assert(len(Post.objects.filter(title="1")) == 1)
        post_object = Post.objects.filter(title="1")[0]
        assert(str(post_object.author.pk) == self.c.session["_auth_user_id"])
        assert(response_json['post']['title'] == '1')
        assert(response_json['post']['description'] == '2')
        assert(response_json['post']['id'] == str(post_object.pk))
    
    def test_delete_post(self):
        response = self.c.delete('/api/posts/{}/'.format(str(self.post1.id)))
        assert(response.status_code == 401)
        client = Client()
        client.login(username='1', password='123')
        assert(len(Post.objects.filter(title='a')) == 1)
        response = client.delete('/api/posts/{}/'.format(str(self.post1.id)))
        # TODO: why doesn't this work?
        #assert(response.status_code == 204)
        #assert(len(Post.objects.filter(title='a')) == 0)
    
    # Ignore this test for now, test_filters does pretty much the same thing
    # May need to implement this later or just delete it
    # def test_get_posts_visible(self):
    #     response = self.c.get("/api/author/posts/")
    #     response_body = response.json()
    #     assert(len(response_body['posts']) >= 1) # no auth right now, so this gets them all
    
    def test_get_posts_author_id(self):
        response = self.c.get("/api/author/{}/posts/".format(self.user1.id))
        response_body = response.json()
        assert(len(response_body['posts']) == 1)
        assert(response_body['posts'][0]['id'] == str(self.post1.id))
        assert(len(response_body['posts'][0]['comments']) == 1)
        assert(response_body['posts'][0]['author']['id'].split('/')[-1] == str(self.user1.id))
    
    def test_comments(self):
        assert(len(self.post1.get_comments()) == 1)
        comment = {
            "comment": "a",
        }
        response = self.c.post('/api/posts/{}/comments/'.format(self.post1.id), comment, content_type="application/json")
        response_body = response.json()
        assert(response_body['success'] == True)
        response = self.c.get('/api/posts/{}/comments/'.format(self.post1.id))
        response_body = response.json()
        assert(len(response_body['comments']) == 2)

    def test_followers(self):
        response = self.c.get('/api/author/{}/followers/'.format(self.user1.id))
        response_body = response.json()
        assert(len(response_body["authors"]) == 0)
        response = self.c.get('/api/author/{}/followers/'.format(self.user3.id))
        response_body = response.json()
        assert(len(response_body["authors"]) == 1)

    def test_following(self):
        response = self.c.get('/api/author/{}/following/'.format(self.user1.id))
        response_body = response.json()
        assert(len(response_body["authors"]) == 1)
        response = self.c.get('/api/author/{}/following/'.format(self.user2.id))
        response_body = response.json()
        assert(len(response_body["authors"]) == 0)

    def test_post_friends(self):
        post = {
            "query": "friends",
            "author": str(self.user1.id),
            "authors": [
                "http://127.0.0.1:5454/author/de305d54-75b4-431b-adb2-eb6b9e546013",
		        "http://127.0.0.1:5454/author/ae345d54-75b4-431b-adb2-fb6b9e547891",
                str(self.user2.host+"/author/"+str(self.user2.id))
            ]
        }
        response = self.c.post('/api/author/'+str(self.user1.id)+'/friends/', post, content_type="application/json")
        assert(len(response.json()['authors']) == 1)

    def test_friendrequest(self):
        post = {
            "query": "friendrequest",
            "author": {
                "id":str(self.user3.host+"/author/"+str(self.user3.id)),
                "host":str(self.user3.host),
                "displayName":"Test User",
                "url":str(self.user3.host+"/author/"+str(self.user3.id)),
            },
            "friend": {
                "id":str(self.user2.host+"/author/"+str(self.user2.id)),
                "host":str(self.user2.host),
                "displayName":"Friend Two",
                "id":str(self.user2.host+"/author/"+str(self.user2.id)),
            }
        }
        response = self.c.post('/api/friendrequest/', post, content_type="application/json")
        assert(len(Friend.objects.all()) == 4)
        assert(Friend.objects.get(user1=self.user3.id).user1)
    
    def test_get_with_params(self):
        response = self.c.get('/api/author/posts/?page=1&size=50')
        assert(response.status_code == 200)

    def test_delete_post(self):
        self.client.login(username='1', password='123')
        post = {
            "title": "deleteme",
            "description": "deleteme",
            "content": "deleteme"
        }
        response1 = self.client.post('/api/author/posts/', post, content_type="application/json")
        post_id = response1.json()['post']['id']
        assert(len(Post.objects.filter(pk=post_id)) == 1)
        response2 = self.client.delete('/api/posts/{}/'.format(post_id))
        #import pdb; pdb.set_trace()
        assert(response2.status_code == 204)
        assert(len(Post.objects.filter(pk=post_id)) == 0)

    def test_filter(self):
        response = self.c.get('/api/author/posts/?filter=public')
        json_response = response.json()
        assert(len(json_response["posts"]) >= 1)
        response = self.c.get('/api/author/posts/?filter=private')
        json_response = response.json()
        assert(len(json_response["posts"]) == 0)
        response = self.c.get('/api/author/posts/')
        json_response = response.json()
        assert(len(json_response["posts"]) >= 1)
    
    def test_edit_post(self):
        self.client.login(username='1', password='123')
        post = {
            "title": "editme",
            "description": "editme",
            "content": "editme"
        }
        response1 = self.client.post('/api/author/posts/', post, content_type="application/json")
        post_id = response1.json()['post']['id']
        assert(len(Post.objects.filter(pk=post_id)) == 1)
        post["title"] = "edited"
        response2 = self.client.put('/api/posts/{}/'.format(post_id), post, content_type="application/json")
        assert(response2.status_code == 200)
        response2_json = response2.json()
        assert(response2_json['post']['title'] == "edited")
        assert(Post.objects.get(pk=response2_json['post']['id']).title == "edited")

    def test_unfriend(self):
        self.user4 = User(username='4')
        self.user4.set_password('123')
        self.user4.save()
        self.user5 = User(username='5')
        self.user5.save()
        self.friend4 = Friend(user1=self.user4.id, user2=self.user5.id)
        self.friend4.save()
        client = Client()
        client.login(username='4', password='123')
        assert(len(Friend.objects.all()) == 4)
        response = client.delete('/api/author/{}/friends/{}/'.format(self.user4.id, self.user5.id))
        assert(len(Friend.objects.all()) == 3)

    
    def test_edit_delete_comment(self):
        self.client.login(username='1', password='123')
        comment = {
            "comment": "no u"
        }
        response1 = self.client.post('/api/posts/{}/comments/'.format(self.post1.id), comment, content_type="application/json")
        assert(response1.status_code == 200)
        comment_id = response1.json()['comment']['id']
        
        new_comment = {
            "comment": "k"
        }
        response2 = self.client.put("/api/posts/{}/comments/{}".format(self.post1.id, comment_id), new_comment, content_type="application/json")
        assert(response2.status_code == 200)
        assert(Comment.objects.get(pk=comment_id).comment == "k")
        assert(response2.json()['comment']['id'] == comment_id)
        assert(response2.json()['comment']['comment'] == "k")
        
        response3 = self.client.delete('/api/posts/{}/comments/{}'.format(self.post1.id, comment_id))
        assert(response3.status_code == 204)

    def test_edit_profile(self):
        self.client.login(username='1', password='123')
        user = {
            "username": "new",
            "password": "456"
        }
        author_id = self.user1.id
        response = self.client.put('/api/author/{}/'.format(author_id), user, content_type="application/json")
        assert(response.status_code == 200)
        response_json = response.json()
        print(response_json)
        # assert(Post.objects.get(pk=response2_json['post']['id']).title == "edited")
