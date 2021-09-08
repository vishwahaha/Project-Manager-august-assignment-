from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'project_manager'

r1 = DefaultRouter()
r1.register(r'project', views.ProjectViewSet, basename = 'project')

urlpatterns = [
    #Entry point
    path('', views.index, name = 'index'),

    #Login
    path('login', views.oauth2_redirect, name = 'oauth_redirect'),
    path('oauth', views.oauth2_authcode, name = 'oauth_auth_code'),

    #Static pages
    path('home', views.home, name = 'home'),

    #projects, lists, cards
    path('', include((r1.urls, app_name))),

    path('project/<int:project_id>/list/', views.ListCreateOrList.as_view(), name = 'list_post_or_list'),
    path('project/<int:project_id>/list/<int:list_id>/', views.ListDetail.as_view(), name = 'list_detail'),
    path('project/<int:project_id>/list/<int:list_id>/card/', views.CardCreateOrList.as_view(), name = 'card_post_or_list'),
    path('project/<int:project_id>/list/<int:list_id>/card/<int:card_id>/', views.CardDetail.as_view(), name = 'card_detail'),
    path('project/<int:project_id>/list/<int:list_id>/card/<int:card_id>/comments/', views.CommentCreateOrList.as_view(), name = 'comment_post_or_list'),
    path('project/<int:project_id>/list/<int:list_id>/card/<int:card_id>/comments/<int:comment_id>', views.CommentDetail.as_view(), name = 'comment_detail'),

    #Verify identity while serving static pages
    path('static_file_auth', views.static_auth, name = 'static_file_auth'),

    #User list for doing admin only actions
    path('admin_user_interface', views.admin_user_interface, name = 'admin_user_interface'),

    #Exit/logout
    path('logout', views.logout_view, name = 'logout'),
]