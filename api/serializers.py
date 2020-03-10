from rest_framework import serializers
from .models import User, Post


class UserSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    # TODO: what is the difference between url and id?
    displayName = serializers.CharField(source='username')
    host = serializers.URLField()
    github = serializers.URLField()
    
    def get_id(self, obj):
        return "{}{}".format(obj.host, obj.id)


class CommentSerializer(serializers.Serializer):
    id = serializers.CharField()
    comment = serializers.CharField()
    contentType = serializers.CharField()
    published = serializers.DateTimeField()
    author = UserSerializer()


class PostSerializer(serializers.Serializer):
    title = serializers.CharField()
    description = serializers.CharField()
    contentType = serializers.CharField()
    content = serializers.CharField()
    source = serializers.URLField()
    origin = serializers.URLField()
    author = UserSerializer()
    comments = CommentSerializer(source='get_comments', many=True)
    published = serializers.DateTimeField()
    visibility = serializers.CharField()
    unlisted = serializers.BooleanField()
