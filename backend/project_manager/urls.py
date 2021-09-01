from django.urls import path, include
from . import views

app_name = 'project_manager'
urlpatterns = [
    path('', views.index, name = 'index'),
    path('login', views.oauth2_redirect, name = 'oauth_redirect'),
    path('oauth', views.oauth2_authcode, name = 'oauth_auth_code'),
    path('home', views.after_auth, name = 'after_auth'),
    path('logout', views.logout_view, name = 'logout')
]
