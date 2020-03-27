from django.core.paginator import Paginator
from .models import Post, User, Comment, RemoteLogin, LocalLogin
import copy
import requests
import base64

def create_pagination_info(request, objects_paginator: Paginator, page, size, filter_):
    uri = request.build_absolute_uri()
    info = dict()
    if page > 1 and objects_paginator.page(page).has_previous():
        prev = "{}?page={}&size={}&filter=".format(uri, objects_paginator.previous_page_number(), size, filter_)
        info["previous"] = prev
    if objects_paginator.page(page).has_next():
        next = "{}?page={}&size={}&filter=".format(uri, objects_paginator.next_page_number(), size, filter_)
        info["next"] = next
    return info

def get_post_query_params(request):
    page = int(request.GET.get('page', 1))
    size = int(request.GET.get('size', 50))
    filter_ = request.GET.get('filter', '')
    return page, size, filter_

class Group4Adapter:

    def __init__(self):
        self.path = "https://cmput404-group-project-mandala.herokuapp.com/"

    def create_author(self, author_json):
        # print('Author: {}'.format(author_json))
        id = author_json['id'].split('/')[-1]
        author_json['local'] = False
        author_json['id'] = id
        author_obj = User(**author_json)
        author_obj.username = author_json['displayName']
        author_obj.password = ""
        author_obj.save()
        return author_obj

    def create_post(self, post_json):
        post_json_d = copy.deepcopy(post_json)
        # print("Post: {}".format(post_json))
        id = post_json_d['id']
        print("Post: {}".format(post_json_d))
        # post_json_d['author'] = self.create_author(post_json_d['author'])
        post_json_d['local'] = False
        post_json_d.pop('count', None)
        post_json_d.pop('next', None)
        post_json_d.pop('comments', None)
        post_json_d.pop('size', None)

        # import pdb; pdb.set_trace()

        if post_json_d['contentType'] == 'TYPE_PLAIN':
            # pdb.set_trace()
            post_json_d['contentType'] = 'text/plain'
        
        if post_json_d['contentType'] == 'TYPE_MARKDOWN':
            # pdb.set_trace()
            post_json_d['contentType'] = 'text/markdown'

        post_obj = Post(**post_json_d)
        post_obj.save()
        return post_obj

    def create_comment(self, comment_json):
        #print("Comment: {}".format(comment_json))
        id = comment_json['id']
        comment_json['local'] = False
        comment_obj = Comment(**comment_json)
        
        comment_obj.save()
        return comment_obj

    def get_friends_path(self, author):
        path = self.path + 'author/' + author.id.split('/')[-1] + '/friends'
        return path

    def get_author_path(self, author):
        path = self.path + 'author/' + author.id.split('/')[-1]
        return path

    def get_request(self, url, login):
        headers = {
            'Authorization': 'Basic '+login.get_authorization(),
            'Accept': 'application/json',
        }
        # import pdb; pdb.set_trace()
        response = requests.get(url, headers=headers)
        return response

class Group3Adapter:

    def __init__(self):
        self.path = "http://dsnfof.herokuapp.com/api/"

    def create_author(self, author_json):
        # print('Author: {}'.format(author_json))
        id = author_json['id'].split('/')[-1]
        author_json['id'] = id
        author_json['local'] = False
        author_obj = User(**author_json)
        author_obj.username = author_json['displayName']
        author_obj.password = ""
        author_obj.save()
        return author_obj

    def create_post(self, post_json):
        post_json_d = copy.deepcopy(post_json)
        print("Post: {}".format(post_json))
        id = post_json_d['id']
        # post_json_d['author'] = self.create_author(post_json_d['author'])
        post_json_d['local'] = False
        post_json_d.pop('count', None)
        post_json_d.pop('next', None)
        post_json_d.pop('comments', None)

        post_obj = Post(**post_json_d)
        post_obj.save()
        return post_obj

    def create_comment(self, comment_json):
        #print("Comment: {}".format(comment_json))
        id = comment_json['id']
        comment_json['local'] = False
        comment_obj = Comment(**comment_json)
        
        comment_obj.save()
        return comment_obj

    def get_friends_path(self, author):
        path = self.path + 'author/' + author.id.split('/')[-1] + '/friends'
        return path

    def get_author_path(self, author):
        path = self.path + 'author/' + author.id.split('/')[-1]
        return path

    def get_request(self, url, login):
        headers = {"Authorization": login.get_authorization()}
        response = requests.get(url, headers=headers, allow_redirects=True)
        return response

# initialize the adapters for the groups
group3adapter = Group3Adapter()
group4adapter = Group4Adapter()

adapters = {
    "https://dsnfof.herokuapp.com/api/": group3adapter,
    "https://cmput404-group-project-mandala.herokuapp.com/": group4adapter
}

def authenticate_node(request):
    try:
        auth_header_value = request.headers.get('Authorization','')
        _, auth = auth_header_value.split(' ')
        username, password = base64.b64decode(auth).decode().split(':')
        login = LocalLogin.objects.get(username=username)
        return login.get_authorization() == auth
    except Exception as e:
        return False