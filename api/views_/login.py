from django.contrib import auth
from django.views.decorators.http import require_http_methods, require_POST
from django.http import *

from ..utils import try_extract_schema
from ..serializers import UserSerializer
from ..models import User


@require_http_methods(['GET', 'POST'])
def login(request):
    if request.method == 'POST':
        # Log in.
        data = try_extract_schema({
                'username': str,
                'password': str,
            }, request.body)
        if data is None:
            return HttpResponseBadRequest("Invalid request")

        user = auth.authenticate(request, **data)
        if user is None:
            return HttpResponseBadRequest("Incorrect username or password")
        elif not user.approved:
            return HttpResponseBadRequest("Account is waiting for approval")
        auth.login(request, user)
        return HttpResponse()

    elif request.method == 'GET':
        # Get the logged in user.
        if request.user.is_authenticated:
            return JsonResponse({
                    'id': request.user.id,
                    'username': request.user.username,
                    'github': request.user.github,
                })
        else:
            return HttpResponseBadRequest("Not logged in")


@require_POST
def register(request):
    data = try_extract_schema({
            'username': str,
            'password': str,
            'github': str
        }, request.body)
    if data is None:
        return HttpResponseBadRequest("Invalid request")

    if data['username'].startswith('$'):
        return HttpResponseBadRequest("Invalid username")

    if User.objects.filter(username=data['username']):
        return HttpResponseBadRequest("Username in use")

    user = User.objects.create_user(**data, displayName=data['username'])
    return HttpResponse(status=201)


@require_POST
def logout(request):
    auth.logout(request)
    return HttpResponse()
