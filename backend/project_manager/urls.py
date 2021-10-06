from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'project_manager'

r1 = DefaultRouter()
r1.register(r'project', views.ProjectViewSet, basename = 'project')

r2 = DefaultRouter()
r2.register(r'user', views.UserViewSet, basename = 'user')

urlpatterns = [
    #Login
    path('oauth', views.oauth2_login, name = 'oauth'),

    #Home page, lists all projects in category
    path('home', views.home, name = 'home'),

    #Users
    path('', include(r2.urls)),
    path('user_details', views.user_details, name = 'user_details'),

    #projects, lists, cards
    path('', include(r1.urls)),
    path('project/<int:project_id>/list/', views.ListCreateOrList.as_view(), name = 'list_post_or_list'),
    path('project/<int:project_id>/list/<int:list_id>/', views.ListDetail.as_view(), name = 'list_detail'),
    path('project/<int:project_id>/list/<int:list_id>/card/', views.CardCreateOrList.as_view(), name = 'card_post_or_list'),
    path('project/<int:project_id>/list/<int:list_id>/card/<int:card_id>/', views.CardDetail.as_view(), name = 'card_detail'),
    path('project/<int:project_id>/list/<int:list_id>/card/<int:card_id>/comments/', views.CommentCreateOrList.as_view(), name = 'comment_post_or_list'),
    path('project/<int:project_id>/list/<int:list_id>/card/<int:card_id>/comments/<int:comment_id>/', views.CommentDetail.as_view(), name = 'comment_detail'),

    #Dashboard
    path('dashboard', views.dashboard, name = 'dashboard'),

    #Cookie check
    path('check_cookie', views.check_cookie, name = 'check_cookie'),

    #Exit/logout
    path('logout', views.logout, name = 'logout'),
]