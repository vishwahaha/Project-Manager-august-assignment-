import json
import datetime
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from project_manager import models
from project_manager import serializers
from rest_framework.authtoken.models import Token

class CommentConsumer(WebsocketConsumer):

    def connect(self):
        try:
            user_data = self.scope['cookies']['project_manager'].split('__')
            user = models.user.objects.get(user_id = int(user_data[0]))

            if Token.objects.get(user = user).key == user_data[1]:
                self.scope['user'] = user
                self.room_name = self.scope['url_route']['kwargs']['card_id']
                self.room_group_name = 'card_%s' % self.room_name

                # Join room group
                async_to_sync(self.channel_layer.group_add)(
                    self.room_group_name,
                    self.channel_name
                )
                self.accept()
            else:
                pass
        except:
            pass

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
    
    def leave(self, data):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def load_comments(self, data):
        try:
            card = models.card.objects.get(id = self.scope['url_route']['kwargs']['card_id'])
            comments = card.comment_set.all()
            serializer = serializers.commentSerializer(comments, many = True)
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                'type': 'send_info',
                'variant' : 'loaded_comments',
                'comments': serializer.data,
                }   
            )
        except:
            pass

    def new_comment(self, data):
        try:
            commentor = models.user.objects.get(user_id = data['commentor'])
            card = models.card.objects.get(id = data['card'])
            utc_time = datetime.datetime.now(datetime.timezone.utc).isoformat()
            comment = models.comment.objects.create(
                commentor = commentor, 
                content = data['content'], 
                card = card, 
                timestamp = utc_time,
            )
            serializer = serializers.commentSerializer(comment)
            res_dict = serializer.data
            res_dict['variant'] = 'new_comment'
            res_dict['type'] = 'send_info'
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                res_dict,
            )
        except:
            pass
    
    def delete_comment(self, data): 
        try: 
            comment = models.comment.objects.get(id = data['id'])
            if self.scope['user'].user_id == comment.commentor.user_id:
                comment.delete()
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                    'type': 'send_info',
                    'variant': 'delete_comment',
                    'id': data['id'],
                    },
                )
        except:
            pass
        
    def edit_comment(self, data):
        try:
            comment = models.comment.objects.get(id = data['id'])
            if self.scope['user'].user_id == comment.commentor.user_id:
                comment.content = data['content']
                comment.is_edited = True
                comment.save()
                res_dict = serializers.commentSerializer(comment).data
                res_dict['variant'] = 'edited_comment'
                res_dict['type'] = 'send_info'
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    res_dict,
                )
        except:
            pass

    # Receive message from room group
    def send_info(self, event):

        # Send message to WebSocket
        self.send(text_data = json.dumps(event))

    commands = {
        'load_comments': load_comments,
        'new_comment': new_comment,
        'delete_comment': delete_comment,
        'edit_comment': edit_comment,    
        'disconnect': leave,
    }

    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)