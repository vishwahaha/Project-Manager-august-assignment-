from django.urls import path
from . import consumer

ws_urlpatterns = [
    path('ws/project/<int:project_id>/list/<int:list_id>/card/<int:card_id>/comment/', consumer.CommentConsumer.as_asgi()),
]