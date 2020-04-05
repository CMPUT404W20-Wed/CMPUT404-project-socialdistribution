from urllib.parse import urlparse

from django.http import *
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_safe
from django.views.decorators.gzip import gzip_page

from ..models import RemoteLogin
from ..utils import *

@require_safe
def media_redir(request, url):
    try:
        r = urlparse(url)
        host = "https://" + r.netloc + "/"
        remote_f = RemoteLogin.objects.filter(host__startswith=host)
        if not remote_f:
            return HttpResponseRedirect(url)
        remote = remote_f[0]

        adapter = adapters[remote.host]

        response = adapter.get_request(url, remote)
        print(url, response.content)
        data = response.json()
        post = data['posts'][0]

        if post['contentType'] == 'image/png;base64':
            suffix = 'png'
        elif post['contentType'] == 'image/jpeg;base64':
            suffix = 'jpeg'
        else:
            print("Bad content-type", post['contentType'])
            return HttpResponseBadRequest()

        author_obj = adapter.create_author(post['author'])
        post['author'] = author_obj
        adapter.create_post(post)
        return HttpResponseRedirect('/api/media/' + post['id'] + '.' + suffix)
    except ValueError as e:
        print(e)
        return HttpResponseBadRequest()
