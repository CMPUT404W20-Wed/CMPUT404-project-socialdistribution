from .models import User, Post, Friend

def apply_filter(request, filter_status):
    # Get all posts and filter them to make sure the visibility matches what we need
    all_posts = Post.objects.all()

    filter_status = filter_status.upper()
    posts = filter_on_status(all_posts, filter_status)

    if filter_status == "PUBLIC" or filter_status == "":
        return posts
    elif filter_status == "PRIVATE":
        return private_filter(request, posts)
    elif filter_status == "FRIENDS":
        return friend_filter(request, posts)
    elif filter_status == "FOAF":
        return foaf_filter(request, posts)
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