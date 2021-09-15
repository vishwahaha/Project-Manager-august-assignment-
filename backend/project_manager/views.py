#Native django imports
from django.http import HttpResponseRedirect

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
from .app_settings.permissons import IsAdminElseReadOnly, IsCommentor, IsCreatorOrAdminElseReadOnly, IsDisabledThenReadOnly, IsProjectMember

#Modules, models etc. imports
from . import models
from . import serializers
import requests

# ----------------VIEWS---------------------

@api_view(['GET'])
def oauth2_login(req):
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

        if data_dict['person']['displayPicture'] is None:
            defaults = {
                'user_id' : data_dict['userId'],
                'full_name' : data_dict['person']['fullName'],
                'enrolment_number' : data_dict['student']['enrolmentNumber'],
            }
        
        else:
            defaults = {
                'user_id' : data_dict['userId'],
                'full_name' : data_dict['person']['fullName'],
                'display_picture' : 'https://channeli.in/' + str(data_dict['person']['displayPicture'] or ''),
                'enrolment_number' : data_dict['student']['enrolmentNumber'],
            }

        if data_dict['person']['roles'][1]['role'] == 'Maintainer' and data_dict['person']['roles'][1]['activeStatus'] == 'ActiveStatus.IS_ACTIVE':
            user_obj, created = models.user.objects.update_or_create(
                defaults = defaults,
                user_id = data_dict['userId']
            )
            user_token = Token.objects.get_or_create(user = user_obj)[0]
            redirect_header = {
                'Authorization' : 'Token ' + user_token.key
            }
            res =  Response(redirect_header, status = status.HTTP_200_OK)
            res['Access-Control-Allow-Origin'] = 'http://localhost:3000'
            res['Access-Control-Allow-Credentials'] = 'true'
            res.set_cookie(key='project_manager', value=str(data_dict['userId']) + '__' + user_token.key, max_age = 30*24*60*60)
            return res
        else:
            res = Response('Site is only accessible to channel-i maintainers.', status = status.HTTP_403_FORBIDDEN)
            res['Access-Control-Allow-Origin'] = 'http://localhost:3000'
            res['Access-Control-Allow-Credentials'] = 'true'
            return res
    else:
        res = Response('Some error occured, try again later', status = status.HTTP_400_BAD_REQUEST)
        res['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        res['Access-Control-Allow-Credentials'] = 'true'
        return res

@api_view(['GET'])
def check_cookie(req):
    """
    Checks if the cookie is set, if it is set then checks the validity and sends the auth token
    """
    try:
        user_data = req.COOKIES['project_manager'].split('__')
        user = models.user.objects.get(user_id = int(user_data[0]))

        if Token.objects.get(user = user).key == user_data[1]:
            res = Response({'Authorization' : 'Token ' + user_data[1]}, status = status.HTTP_200_OK)
            res['Access-Control-Allow-Origin'] = 'http://localhost:3000'
            res['Access-Control-Allow-Credentials'] = 'true'
            return res
        else:
            res = Response({'message' : 'cookie not set or invalid, login through oAuth'}, status = status.HTTP_400_BAD_REQUEST)
            res['Access-Control-Allow-Origin'] = 'http://localhost:3000'
            res['Access-Control-Allow-Credentials'] = 'true'
            return res

    except:
        res = Response({'message' : 'cookie not set or invalid, login through oAuth'}, status = status.HTTP_400_BAD_REQUEST)
        res['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        res['Access-Control-Allow-Credentials'] = 'true'
        return res
        

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def home(req):
    """
    Returns list of projects user is part of
    """
    projects = req.user.project_set.all()
    serialized = serializers.projectSerializer(projects, many = True)
    return Response(serialized.data)

class UserViewSet(viewsets.ModelViewSet):

    serializer_class = serializers.userSerializer
    permission_classes = [IsAuthenticated, IsAdminElseReadOnly]
    http_method_names = ['get', 'head', 'patch',]
    queryset = models.user.objects.all()

    def perform_partial_update(self, serializer):

        if serializer.validated_data['is_disabled']:
            serializer.validated_data['user_type'] = 'normal'
            serializer.save()
        else:
            super().perform_partial_update(self, serializer)


class ProjectViewSet(viewsets.ModelViewSet):

    serializer_class = serializers.projectSerializer
    permission_classes = [IsAuthenticated, IsDisabledThenReadOnly, IsCreatorOrAdminElseReadOnly,]
    lookup_url_kwarg = 'project_id'
    http_method_names = ['get', 'post', 'head', 'patch', 'delete']

    def get_queryset(self):
        user = self.request.user
        return user.project_set
    
    def perform_create(self, serializer):
        member_list = serializer.validated_data['members']
        member_list.append(self.request.user)
        serializer.save(creator = self.request.user, members = member_list)

    def perform_partial_update(self, serializer):
        user_obj = self.request.user

        if user_obj.user_type == 'admin':
            serializer.save()
        
        else:
            member_list = serializer.validated_data['members']
            member_list.append(self.request.user)
            serializer.save(members = member_list)

class ListCreateOrList(generics.ListCreateAPIView):

    serializer_class = serializers.listSerializer
    permission_classes = [IsAuthenticated, IsDisabledThenReadOnly, IsProjectMember, IsCreatorOrAdminElseReadOnly,]

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
    http_method_names = ['get', 'post', 'head', 'patch', 'delete']

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
    http_method_names = ['get', 'post', 'head', 'patch', 'delete']

    def get_queryset(self):
        list = models.list.objects.get(id = self.kwargs['list_id'])
        return list.card_set
    
    def perform_partial_create(self, serializer):
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
        
        serializer.save(creator = self.request.user, assignees = assignees)


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
    http_method_names = ['get', 'post', 'head', 'patch', 'delete']

    def get_queryset(self):
        card = models.card.objects.get(id = self.kwargs['card_id'])
        return card.comment_set

    def partial_update(self, instance, validated_data):
        if instance.content == validated_data['content']:
            return super().partial_update(instance, validated_data)
        else:
            validated_data['is_edited'] == True
            return super().partial_update(instance, validated_data)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def static_auth(req):
    """
    Check if the user is verified before serving static pages
    """
    return Response({'authenticated' : True,})

@api_view(['GET'])
@authentication_classes([TokenAuthentication,])
@permission_classes([IsAuthenticated])
def dashboard(req):
    """
    Returns list of cards user is assigned
    """
    user_obj = req.user
    serialized = serializers.cardSerializer(user_obj.card_set.all(), many = True)
    return Response(serialized.data, status = status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(req):
    """
    Log out the user by deleting to auth token generated.
    """
    user_token = Token.objects.get(user = req.user)
    msg = {'message' : 'Logged out successfully'}
    res = Response(msg, status = status.HTTP_200_OK)

    try:
        user_token.delete()
        res.delete_cookie('project_manager')
    except:
        pass

    return res
