from django.http import HttpResponse
from django.template import loader

def app(req):
    template = loader.get_template('social_backend/index.html')
    return HttpResponse(template.render({}, req))
