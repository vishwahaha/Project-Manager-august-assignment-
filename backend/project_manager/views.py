#Native django imports
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse

#REST Framework imports
from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

#Custom imports
from .param_settings.oauth2_params import auth_params
from .utils.auth_utils import login, logout, login_needed, redirect_if_loggedin

#Modules, models etc. imports
from . import models
from . import serializers
import requests
import json


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

#Have to customize these viewsets for permissons
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = models.project.objects.all()
    serializer_class = serializers.projectSerializer
    permission_classes = [IsAuthenticated]

class ListViewSet(viewsets.ModelViewSet):
    queryset = models.list.objects.all()
    serializer_class = serializers.listSerializer
    permission_classes = [IsAuthenticated]

class CardViewSet(viewsets.ModelViewSet):
    queryset = models.card.objects.all()
    serializer_class = serializers.cardSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def static_auth(req):
    content = {'authenticated' : True,}
    return Response(content)

def logout_view(req):
    """
    Log out the user by flushing session data.
    """
    return logout(req, 'project_manager:index')
