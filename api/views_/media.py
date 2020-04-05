import base64

from ..models import User, Post, Comment, Friend
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_safe
from django.views.decorators.gzip import gzip_page

from ..utils import authenticate_node

@require_safe
@gzip_page
def media(request, pid, format_):
    ''' Get a post containing image content, and return it as an image. '''
    # Decode the image
    post = get_object_or_404(Post, pk=pid)
    content = base64.b64decode(post.content)

    # Check if the post is visible to the current user
    if not (request.user.is_authenticated or authenticate_node(request)):
        return HttpResponse(status=401, content="Unauthorized")

    # Determine the format
    if format_ == 'png':
        content_type = 'image/png'
    elif format_ == 'jpeg':
        content_type = 'image/jpeg'
    else:
        return HttpResponseBadRequest()

    # Validate the format
    if (content_type + ';base64') != post.contentType:
        return HttpResponseBadRequest()

    return HttpResponse(
            content=content,
            content_type=content_type,
        )
