from .models import User, Post, Friend

def apply_filter(request, filter_status):
    # Get all posts and filter them to make sure the visibility matches what we need
    all_posts = Post.objects.all()

    filter_status = filter_status.upper()
    visibilities = ["PUBLIC", "PRIVATE", "FRIENDS", "FOAF", "SERVERONLY", "AUTHOR"]
    if filter_status not in visibilities:
        filter_status = "PUBLIC"

    posts = filter_on_status(all_posts, filter_status)

    if filter_status == "PUBLIC" or filter_status == "":
        return posts
    elif filter_status == "PRIVATE":
        return private_filter(request, posts)
    elif filter_status == "FRIENDS":
        return friend_filter(request, posts)
    elif filter_status == "FOAF":
        return foaf_filter(request, posts)
    elif filter_status == "SERVERONLY":
        return host_filter(request, posts)
    elif filter_status == "AUTHOR":
        return author_filter(request, posts)
    else:
        return posts

# Return all posts of a particular status
def filter_on_status(all_posts, filter_status):
    posts = []
    for post in all_posts:
        if post.visibility == filter_status:
            posts.append(post)

    return posts

# Return all my private posts
def private_filter(request, posts):
    for post in posts:
        if request.user.id != post.author.id:
            posts.remove(post)

    return posts

# Return all friend posts
def friend_filter(request, posts):
    user_id = request.user.id

    for post in posts:
        post_author = post.author.id
        friendship = Friend.objects.filter(user1=user_id, user2=post_author) and Friend.objects.filter(user1=post_author, user2=user_id)
        if (not friendship):
            posts.remove(post)

    return posts

# Return all friend of a friend posts
def foaf_filter(request, posts):
    user_id = request.user.id

    foaf_posts = []
    for post in posts:
        # First, find all people the FOAF post author follows
        post_author = post.author.id
        author_friends = Friend.objects.filter(user1=post_author)
        for friend in author_friends:
            if Friend.objects.filter(user1=friend.user2, user2=post_author):
                # Both users are friends, check for a connection with this friend
                # and the user getting foaf posts
                friendship = Friend.objects.filter(user1=friend.user2, user2=user_id) and Friend.objects.filter(user1=user_id, user2=friend.user2)
                if friendship:
                    # Have a foaf connection, add post
                    foaf_posts.append(post)

    return foaf_posts

# Posts I create be private to friends on my host
def host_filter(request, posts):
    # Get all posts of friends that have host filter
    friend_posts = friend_filter(request, posts)
    user_host = request.user.host

    # Remove posts coming from a different host
    for post in friend_posts:
        author_host = post.author.host
        if (author_host != user_host):
            friend_posts.remove(post)

    return friend_posts

# Return posts private for this author
# Currently can't test this function as it has no corresponding visibility
def author_filter(request, posts):
    user_id = request.user.id

    return_posts = []
    for post in posts:
        private_to = None # Will need to update this
        if private_to == user_id:
            return_posts.append(post)

    return return_posts