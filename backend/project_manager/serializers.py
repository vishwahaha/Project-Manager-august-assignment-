from rest_framework import serializers
from . import models

class userSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.user
        fields = [
            'user_id',
            'full_name', 
            'display_picture', 
            'enrolment_number', 
            'user_type',
            'online_status',
            'is_disabled',
        ]

class commentSerializer(serializers.ModelSerializer):

    commentor = serializers.PrimaryKeyRelatedField(read_only = True)
    card = serializers.PrimaryKeyRelatedField(read_only = True)
    id = serializers.ReadOnlyField()
    is_edited = serializers.ReadOnlyField()

    class Meta:
        model = models.comment
        fields = [
            'id',
            'commentor',
            'content',
            'card',
            'is_edited',
        ]

class cardSerializer(serializers.ModelSerializer):

    assignees = serializers.PrimaryKeyRelatedField(allow_empty = True, many = True, queryset = models.user.objects.all())
    creator = serializers.PrimaryKeyRelatedField(read_only = True)
    list = serializers.PrimaryKeyRelatedField(read_only = True)
    id = serializers.ReadOnlyField()

    class Meta:
        model = models.card
        fields = [
            'id',
            'list',
            'title',
            'desc',
            'creator',
            'assignees',
            'finished_status',
        ]
class listSerializer(serializers.ModelSerializer):

    project = serializers.PrimaryKeyRelatedField(read_only = True)
    creator = serializers.PrimaryKeyRelatedField(read_only = True)
    card_set = cardSerializer(read_only = True, many = True)
    id = serializers.ReadOnlyField()
    time_stamp = serializers.ReadOnlyField()
    class Meta:
        model = models.list
        fields = [
            'id',
            'project',
            'title',
            'creator',
            'time_stamp',
            'finished_status',
            'card_set',
        ]
class projectSerializer(serializers.ModelSerializer):

    creator = serializers.PrimaryKeyRelatedField(read_only = True)
    list_set = listSerializer(read_only = True, many = True)
    id = serializers.ReadOnlyField()
    date_created = serializers.ReadOnlyField()
    class Meta:
        model = models.project
        fields = [
            'id',
            'creator',
            'date_created',
            'members',
            'name',
            'wiki',
            'finished_status',
            'list_set',
        ]
