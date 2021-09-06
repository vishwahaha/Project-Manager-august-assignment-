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

class projectSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.project
        fields = [
            'creator',
            'date_created',
            'members',
            'name',
            'wiki',
            'finished_status',
        ]


class listSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.list
        fields = [
            'project',
            'title',
            'creator',
            'time_stamp',
            'finished_status',
        ]

class cardSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.card
        fields = [
            'list',
            'title',
            'desc',
            'creator',
            'assignees',
            'finished_status',
        ]

class commentSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.comment
        fields = [
            'commentor',
            'content',
        ]

