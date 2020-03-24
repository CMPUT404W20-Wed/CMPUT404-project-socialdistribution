from django.core.paginator import Paginator


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
