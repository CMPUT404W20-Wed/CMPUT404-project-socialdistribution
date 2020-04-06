from django.http import HttpResponse
from django.template import loader
from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie
def app(req):
    template = loader.get_template('social_backend/index.html')
    return HttpResponse(template.render({}, req))
