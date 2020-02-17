from django.http import HttpResponse

# TODO this is probably not the correct way to do this.
# This is just to prove that the frontend is set up correctly!
demo_html = open('social_backend/static/stream.html').read()

def demo_view(req):
    return HttpResponse(demo_html)
