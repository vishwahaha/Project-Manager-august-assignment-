#Native django imports
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse

#REST Framework imports
from rest_framework import generics, status
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

#Custom imports
from .app_settings.oauth2_params import auth_params
from .app_settings.permissons import IsAdmin, IsCommentor, IsCreatorOrAdminElseReadOnly, IsDisabledThenReadOnly, IsProjectMember
from .utils.auth_utils import login, logout, login_needed, redirect_if_loggedin

#Modules, models etc. imports
from . import models
from . import serializers
import requests

# ----------------VIEWS---------------------

def index(req):
    """
    This will become the entry point, with a button to login with channel-i and a checkbox to remember me.
    """
    return HttpResponse("Hello! This is the first page.")

@redirect_if_loggedin('project_manager:after_auth')
def oauth2_redirect(req):
    """
    Redirects to the link to initiante oAuth2
    """
    url = f"https://channeli.in/oauth/authorise/?client_id={auth_params['CLIENT_ID']}&redirect_uri={auth_params['REDIRECT_URI']}&state={auth_params['STATE_STRING']}"
    return HttpResponseRedirect(url)

@api_view(['GET'])
def oauth2_authcode(req):
    """
    Sends post request to oAuth server with required params, then logs/signs the user in(if qualified to do so)
    """
    parameters = {
        'client_id' : auth_params['CLIENT_ID'],
        'client_secret' : auth_params['CLIENT_SECRET'],
        'grant_type' : 'authorization_code',
        'redirect_uri' : auth_params['REDIRECT_URI'],
        'code' : req.GET.get('code', None),
    }
    res = requests.post(
        "https://channeli.in/open_auth/token/", data = parameters)

    if(res.status_code == 200):
        data = res.json()
        header = {
            "Authorization": "Bearer " + data['access_token']
        }

        data_res = requests.get(
            "https://channeli.in/open_auth/get_user_data/", headers = header)
        data_dict = data_res.json()

        if data_dict['person']['roles'][1]['role'] == 'Maintainer' and data_dict['person']['roles'][1]['activeStatus'] == 'ActiveStatus.IS_ACTIVE':
            user_obj, created = models.user.objects.update_or_create(
                defaults = {
                    'user_id' : data_dict['userId'],
                    'full_name' : data_dict['person']['fullName'],
                    'display_picture' : data_dict['person']['displayPicture'],
                    'enrolment_number' : data_dict['student']['enrolmentNumber'],
                },
                user_id = data_dict['userId']
            )
            user_token = Token.objects.get(user = user_obj)
            redirect_header = {
                'Authorization' : 'Token ' + user_token.key
            }
            login(req, user_obj)
            return Response(redirect_header)
        else:
            return Response('Site is only accessible to channel-i maintainers.', status = status.HTTP_403_FORBIDDEN)
    else:
        return Response('Some error occured, try again later', status = status.HTTP_503_SERVICE_UNAVAILABLE)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def home(req):
    projects = models.user.objects.get(user_id = req.session['user_id']).project_set.all()
    serialized = serializers.projectSerializer(projects, many = True)
    return Response(serialized.data)

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.projectSerializer
    permission_classes = [IsAuthenticated, IsDisabledThenReadOnly, IsCreatorOrAdminElseReadOnly,]

    def get_queryset(self):
        user = self.request.user
        return user.project_set
    
    def perform_create(self, serializer):
        member_list = serializer.validated_data['members']
        member_list.append(self.request.user)
        member_list = list(set(member_list))
        serializer.save(creator = self.request.user, members = member_list)

class ListCreateOrList(generics.ListCreateAPIView):

    serializer_class = serializers.listSerializer
    permission_classes = [IsAuthenticated,IsDisabledThenReadOnly, IsProjectMember, IsCreatorOrAdminElseReadOnly,]

    def get_queryset(self):
        project = models.project.objects.get(id = self.kwargs['project_id'])
        return project.list_set
    
    def perform_create(self, serializer):
        project = models.project.objects.get(id = self.kwargs['project_id'])
        serializer.save(creator = self.request.user, project = project)

class ListDetail(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = serializers.listSerializer
    permission_classes = [IsAuthenticated, IsDisabledThenReadOnly, IsProjectMember, IsCreatorOrAdminElseReadOnly,]
    lookup_url_kwarg = 'list_id'

    def get_queryset(self):
        project = models.project.objects.get(id = self.kwargs['project_id'])
        return project.list_set

class CardCreateOrList(generics.ListCreateAPIView):

    serializer_class = serializers.cardSerializer
    permission_classes = [IsAuthenticated, IsDisabledThenReadOnly, IsProjectMember, IsCreatorOrAdminElseReadOnly,]

    def get_queryset(self):
        list = models.list.objects.get(id = self.kwargs['list_id'])
        return list.card_set
    
    def perform_create(self, serializer):
        list_obj = models.list.objects.get(id = self.kwargs['list_id'])
        project = models.project.objects.get(id = self.kwargs['project_id'])
        assignees = serializer.validated_data['assignees']
        assignees = list(set(assignees))
        proj_members = project.members.all()

        """
        Only allow assignees which are members of the project
        """
        for x in assignees:
            if x not in proj_members:
                assignees.remove(x)
        
        serializer.save(creator = self.request.user, list = list_obj, assignees = assignees)
        
class CardDetail(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = serializers.cardSerializer
    permission_classes = [IsAuthenticated, IsDisabledThenReadOnly, IsProjectMember, IsCreatorOrAdminElseReadOnly,]
    lookup_url_kwarg = 'card_id'

    def get_queryset(self):
        list = models.list.objects.get(id = self.kwargs['list_id'])
        return list.card_set

class CommentCreateOrList(generics.ListCreateAPIView):

    serializer_class = serializers.commentSerializer
    permission_classes = [IsAuthenticated, IsDisabledThenReadOnly, IsProjectMember,]

    def get_queryset(self):
        card = models.card.objects.get(id = self.kwargs['card_id'])
        return card.comment_set

    def perform_create(self, serializer):
        card = models.card.objects.get(id = self.kwargs['card_id'])
        serializer.save(commentor = self.request.user, card = card)

class CommentDetail(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = serializers.commentSerializer
    permission_classes = [IsAuthenticated, IsDisabledThenReadOnly, IsProjectMember, IsCommentor]
    lookup_url_kwarg = 'comment_id'

    def get_queryset(self):
        card = models.card.objects.get(id = self.kwargs['card_id'])
        return card.comment_set

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def static_auth(req):
    content = {'authenticated' : True,}
    return Response(content)

@api_view(['GET'])
@authentication_classes([TokenAuthentication,])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_user_interface(req):
    user_list = models.user.objects.all()
    serialized = serializers.userSerializer(user_list, many = True)
    return Response(serialized.data, status = status.HTTP_200_OK) 

def logout_view(req):
    """
    Log out the user by flushing session data.
    """
    return logout(req, 'project_manager:index')
