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
            return HttpResponseBadRequest()

        user = auth.authenticate(request, **data)
        if user is None:
            return HttpResponseBadRequest()
        elif not user.approved:
            return HttpResponseForbidden()
        auth.login(request, user)
        return HttpResponse()

    elif request.method == 'GET':
        # Get the logged in user.
        if request.user.is_authenticated:
            return JsonResponse({
                    'id': request.user.id,
                    'username': request.user.username
                })
        else:
            return HttpResponseBadRequest()


@require_POST
def register(request):
    data = try_extract_schema({
            'username': str,
            'password': str
        }, request.body)
    if data is None:
        return HttpResponseBadRequest()

    if '@' in data['username']:
        # This ensures there are no username conflicts
        # with disambiguated foreign usernames.
        return HttpResponseBadRequest()

    user = User.objects.create_user(**data, displayName=data['username'])
    if user is None:
        return HttpResponseBadRequest()
    else:
        return HttpResponse(status=201)


@require_POST
def logout(request):
    auth.logout(request)
    return HttpResponse()
