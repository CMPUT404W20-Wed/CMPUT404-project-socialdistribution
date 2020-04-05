from rest_framework import serializers
from .models import User, Post

class UserSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    # TODO: what is the difference between url and id?
    displayName = serializers.CharField()
    host = serializers.URLField()
    github = serializers.URLField()
    
    def get_id(self, obj):
        if obj.host.endswith('/'):
            return "{}{}".format(obj.host, obj.id)
        else:
            return "{}/{}".format(obj.host, obj.id)
        #return "{}".format(obj.id)
    
    def get_url(self, obj):
        if obj.host.endswith('/'):
            return "{}{}".format(obj.host, obj.id)
        else:
            return "{}/{}".format(obj.host, obj.id)

class CommentSerializer(serializers.Serializer):
    id = serializers.CharField()
    comment = serializers.CharField()
    contentType = serializers.CharField()
    published = serializers.DateTimeField(format=None)
    author = UserSerializer()


class PostSerializer(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField()
    contentType = serializers.CharField()
    content = serializers.CharField()
    source = serializers.URLField()
    origin = serializers.URLField()
    author = UserSerializer()
    comments = CommentSerializer(source='get_comments', many=True)
    published = serializers.DateTimeField(format=None)
    visibility = serializers.CharField()
    unlisted = serializers.BooleanField()
    categories = serializers.SerializerMethodField()
    visibleTo = serializers.SerializerMethodField()

    def get_categories(self, obj):
        return obj.categories

    def get_visibleTo(self, obj):
        return obj.visibleTo
    
    def get_id(self, obj):
        return "{}{}".format(obj.host, obj.id)
