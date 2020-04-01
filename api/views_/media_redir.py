from urllib.parse import urlparse

from django.http import *
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_safe
from django.views.decorators.gzip import gzip_page

from ..models import RemoteLogin

@require_safe
def media_redir(request, url):
    try:
        r = urlparse(url)
        host = r.scheme + "://" + r.netloc + "/"
        remote_f = RemoteLogin.objects.filter(host__startswith=host)
        if not remote_f:
            return HttpResponseRedirect(url)
        remote = remote_f[0]
        print(r.path)
        return HttpResponse(status=503)
    except ValueError:
        return HttpResponseBadRequest()
