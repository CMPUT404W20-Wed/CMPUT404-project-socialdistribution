from django.http import *
from django.views.decorators.http import require_safe

from ..models import Friend, User

def _relationship(from_user, to_user):
    following = Friend.objects.filter(user1=from_user, user2=to_user).exists()
    follower = Friend.objects.filter(user1=to_user, user2=from_user).exists()

    if following and follower:
        return 'friend'
    elif following:
        return 'following'
    elif follower:
        return 'follower'
    else:
        return ''


@require_safe
def user_search(request):
    if not request.user.is_authenticated:
        return HttpResponse(status=401, content="Unauthorized")

    query = request.GET.get('q')
    if not query:
        return HttpResponseBadRequest()

    result_objects = []

    prefix_results = User.objects.filter(displayName__istartswith=query)
    for r in prefix_results:
        if len(result_objects) >= 10: break
        result_objects.append(r)

    if len(result_objects) < 10:
        infix_results = (
                User.objects
                    .filter(displayName__icontains=query)
                    .exclude(displayName__istartswith=query))
        for r in infix_results:
            if len(result_objects) >= 10: break
            result_objects.append(r)

    results = [
            {
                'id': user.id,
                'displayName': user.displayName,
                'relationship': _relationship(request.user, user),
            } for user in result_objects
        ]

    return JsonResponse({
            'query': 'usersearch',
            'queryString': query,
            'matches': results,
        })
