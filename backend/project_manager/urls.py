from django.urls import path, include
from .views import index

app_name = 'project_manager'
urlpatterns = [
    path('', index, name='index'),
]
