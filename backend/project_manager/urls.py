from django.urls import path, include
from rest_framework import routers
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'project_manager'
urlpatterns = [
    #Entry point
    path('', views.index, name = 'index'),

    #Login
    path('login', views.oauth2_redirect, name = 'oauth_redirect'),
    path('oauth', views.oauth2_authcode, name = 'oauth_auth_code'),

    #GET or POST
    path('home', views.home, name = 'home'),

    #Verify identity while serving static pages
    path('static_file_auth', views.static_auth, name = 'static_file_auth'),

    #Exit/logout
    path('logout', views.logout_view, name = 'logout'),
]

router = DefaultRouter()
router.register(r'project', views.ProjectViewSet, basename = 'project')
router.register(r'project/{project_id}/list', views.ListViewSet, basename = 'list')
router.register(r'project/{project_id}/list/{list_id}/card', views.CardViewSet, basename = 'card')

urlpatterns += router.urls
