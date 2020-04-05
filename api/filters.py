from .models import User, Post, Friend


def user_is_authorized(user, post):
    if post.author.id == user.id:
        # can always see your own posts
        return True
    if post.visibility == 'PUBLIC':
        return True
    elif post.visibility == 'PRIVATE':
        return post.author.id == user.id
    elif post.visibility == 'FRIENDS':
        post_author = post.author.id
        # mutual friendship
        return (Friend.objects.filter(user1=user.id, user2=post_author)
                and Friend.objects.filter(user1=post_author, user2=user.id))
    elif post.visibility == 'FOAF':
        # First, find all people the FOAF post author follows
        post_author = post.author.id
        author_friends = Friend.objects.filter(user1=post_author)
        for friend in author_friends:
            if Friend.objects.filter(user1=friend.user2, user2=post_author):
                # Both users are friends, check for a connection with this friend
                # and the user getting foaf posts
                friendship = (
                        Friend.objects.filter(
                            user1=friend.user2, user2=user.id)
                        and Friend.objects.filter(
                            user1=user.id, user2=friend.user2))
                if friendship:
                    # Have a foaf connection, add post
                    return True
        return False
    elif post.visibility == 'SERVERONLY':
        return (Friend.objects.filter(user1=user.id, user2=post_author)
                and Friend.objects.filter(user1=post_author, user2=user.id)
                and post.author.host == user.host)
    elif post.visibility == 'AUTHOR':
        return str(user.id) in post.visibleTo
    else:
        raise ValueError('Unsupported value for visibility')


def get_posts_by_status(filter_status):
    return list(filter(
            lambda post: post.visibility == filter_status.upper(),
            Post.objects.all()))


def get_public_posts():
    return list(filter(
            lambda post: post.visibility not in ['PRIVATE', 'SERVERONLY'],
            Post.objects.all()))


def apply_filter(request, filter_status):
    # Get all posts and filter them to make sure the visibility matches what we need
    all_posts = Post.objects.all()

    filter_status = filter_status.upper()
    visibilities = ["PUBLIC", "PRIVATE", "FRIENDS", "FOAF", "SERVERONLY", "AUTHOR"]
    if filter_status not in visibilities:
        filter_status = "PUBLIC"

    return list(filter(
        lambda post: user_is_authorized(request.user, post),
        posts))


# Return all posts of a particular status
def filter_on_status(all_posts, filter_status):
    posts = []
    for post in all_posts:
        if post.visibility == filter_status:
            posts.append(post)

    return posts
