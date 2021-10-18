from django.urls import path
from . import consumer

ws_urlpatterns = [
    path('ws/card/<int:card_id>/', consumer.CommentConsumer.as_asgi()),
]