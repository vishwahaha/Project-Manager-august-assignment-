from django.core.mail import send_mail
from django.conf import settings

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
from .app_settings.permissons import IsAdminElseReadOnly, IsCommentor, IsCreatorOrAdminElseReadOnly, IsDisabledThenReadOnly, IsProjectMember, CardPermissons, ListPermsissons

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

    res = requests.post("https://channeli.in/open_auth/token/", data = parameters)

    if(res.status_code == 200):
        data = res.json()
        header = {
            "Authorization": "Bearer " + data['access_token']
        }

        data_res = requests.get(
            "https://channeli.in/open_auth/get_user_data/", headers = header)

        data_dict = data_res.json()

        email= ''
        if data_dict['contactInformation']['emailAddress'] != None:
            email = data_dict['contactInformation']['emailAddress']
        elif data_dict['contactInformation']['instituteWebmailAddress'] != None:
            email = data_dict['contactInformation']['instituteWebmailAddress']
        else:
            email = None

        if data_dict['person']['displayPicture'] is None:
            defaults = {
                'user_id' : data_dict['userId'],
                'full_name' : data_dict['person']['fullName'],
                'display_picture': None,
                'enrolment_number' : data_dict['student']['enrolmentNumber'],
                'email': email,
            }
        
        else:
            defaults = {
                'user_id' : data_dict['userId'],
                'full_name' : data_dict['person']['fullName'],
                'display_picture' : 'https://channeli.in/' + str(data_dict['person']['displayPicture'] or ''),
                'enrolment_number' : data_dict['student']['enrolmentNumber'],
                'email': email,
            }

        if data_dict['person']['roles'][1]['role'] == 'Maintainer' and data_dict['person']['roles'][1]['activeStatus'] == 'ActiveStatus.IS_ACTIVE':
            user_obj, created = models.user.objects.update_or_create(
                defaults = defaults,
                user_id = data_dict['userId']
            )
            if not models.Settings.objects.filter(user = user_obj).exists():
                models.Settings.objects.create(user = user_obj)

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

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_details(req):

    user_obj = req.user
    serialized = serializers.userSerializer(user_obj)
    return Response(serialized.data)

class UserViewSet(viewsets.ModelViewSet):

    serializer_class = serializers.userSerializer
    permission_classes = [IsAuthenticated, IsAdminElseReadOnly]
    http_method_names = ['get', 'head', 'patch',]
    queryset = models.user.objects.all()

    def partial_update(self, request, *args, **kwargs):

        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data, partial=True)

        if serializer.is_valid():
            try:
                if serializer.validated_data['is_disabled']: 
                    serializer.validated_data['user_type'] = 'normal'
                    serializer.save()
                    user_settings = models.Settings.objects.get(user = instance)
                    if user_settings.email_on_disable:
                        if instance.email is not None:
                            send_mail(
                                subject='Disabled on Sorted.',
                                message=f'''Hello,
For some reason you have been disabled by {request.user.full_name}.
If you were an admin, this status has also been removed.
Now, you can't perform any edit/create/delete action.
                                        ''',
                                from_email=settings.EMAIL_HOST_USER,
                                recipient_list=[instance.email,],
                            )
                    return super().partial_update(request, *args, **kwargs)
            except:
                pass

            try:
                if instance.is_disabled:
                    if serializer.validated_data['user_type'] == 'admin':
                        return Response({ 'message' : 'Disabled users cannot be admin' }, status=status.HTTP_400_BAD_REQUEST)
            except:
                pass

            return super().partial_update(request, *args, **kwargs)

        else:
            return super().partial_update(request, *args, **kwargs)

class SettingsDetail(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = serializers.SettingSerializer
    permission_classes = [IsAuthenticated, ]
    http_method_names = ['get', 'head', 'patch',]
    queryset = models.Settings.objects.all()
    
    def get_object(self):
        queryset = self.get_queryset()
        obj = generics.get_object_or_404(queryset, user = self.request.user)
        return obj

class ProjectViewSet(viewsets.ModelViewSet):

    serializer_class = serializers.projectSerializer
    permission_classes = [IsAuthenticated, IsDisabledThenReadOnly, IsCreatorOrAdminElseReadOnly,]
    lookup_url_kwarg = 'project_id'
    http_method_names = ['get', 'post', 'head', 'patch', 'delete']

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'admin':
            return models.project.objects.all()
        return user.project_set

    def retrieve(self, request, *args, **kwargs):
        queryset = models.project.objects.all()
        proj = generics.get_object_or_404(queryset, pk=kwargs['project_id'])
        serializer = serializers.projectSerializer(proj)
        members = models.user.objects.filter(user_id__in=serializer.data['members'])
        member_serializer = serializers.userSerializer(members, many=True)
        res_dict = serializer.data
        res_dict['members'] = member_serializer.data
        return Response(res_dict, status=status.HTTP_200_OK)
    
    def perform_create(self, serializer):
        member_list = serializer.validated_data['members']
        
        member_list.append(self.request.user)
        member_list = list(set(member_list))

        recipient_list = []

        for member in member_list:
            user_settings = models.Settings.objects.get(user = member)
            if user_settings.email_on_project_add:
                if member.email is not None:
                    if member.user_id != self.request.user.user_id:
                        recipient_list.append(member.email)
        
        project = serializer.save(creator = self.request.user, members = member_list)

        send_mail(
            subject='You have been added to a project!',
            message=f'''Hello,
You have been added to {serializer.validated_data["name"]}, a project created by {self.request.user.full_name}.
Click this link to view this project: http://localhost:3000/project/{project.id}
                    ''',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=recipient_list,
        )

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        old_members = instance.members.all()
        serializer = self.serializer_class(instance, data=request.data, partial=True)

        if serializer.is_valid():
            try:
                project_members = serializer.validated_data['members']
                for list in instance.list_set.all():
                    for card in list.card_set.all():
                        for assignee in card.assignees.all():
                            if assignee not in project_members:
                                assignee.card_set.remove(card) 
                instance.save()  

                recipient_list = []
                new_members = [e for e in project_members if e not in old_members]

                for mem in new_members:
                    user_settings = models.Settings.objects.get(user = mem)
                    if user_settings.email_on_project_add:
                        if mem.email is not None:
                            recipient_list.append(mem.email)

                send_mail(
                    subject='You have been added to a project!',
                    message=f'''Hello,
You have been added to {serializer.validated_data["name"]}, a project created by {instance.creator.full_name}.
Click this link to view this project: http://localhost:3000/project/{instance.id}
                            ''',
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=recipient_list,
                )

                return super().partial_update(request, *args, **kwargs)
                                       
            except: 
                pass

            return super().partial_update(request, *args, **kwargs)

        else:
            return super().partial_update(request, *args, **kwargs)

class ListCreateOrList(generics.ListCreateAPIView):

    serializer_class = serializers.listSerializer
    permission_classes = [IsAuthenticated, IsDisabledThenReadOnly, IsProjectMember,]

    def get_queryset(self):
        project = models.project.objects.get(id = self.kwargs['project_id'])
        return project.list_set
    
    def perform_create(self, serializer):
        project = models.project.objects.get(id = self.kwargs['project_id'])
        serializer.save(creator = self.request.user, project = project)

class ListDetail(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = serializers.listSerializer
    permission_classes = [IsAuthenticated, IsDisabledThenReadOnly, IsProjectMember, ListPermsissons]
    lookup_url_kwarg = 'list_id'
    http_method_names = ['get', 'post', 'head', 'patch', 'delete']

    def get_queryset(self):
        project = models.project.objects.get(id = self.kwargs['project_id'])
        return project.list_set
    
    def retrieve(self, request, *args, **kwargs):

        queryset = models.list.objects.all()
        list = generics.get_object_or_404(queryset, pk=self.kwargs['list_id'])
        serializer = serializers.listSerializer(list)
        res_dict = serializer.data
        res_dict['creator'] = serializers.userSerializer(list.creator).data
        res_dict['project_creator'] = serializers.userSerializer(list.project.creator).data
        return Response(res_dict, status=status.HTTP_200_OK)
        
class CardCreateOrList(generics.ListCreateAPIView):

    serializer_class = serializers.cardSerializer
    permission_classes = [IsAuthenticated, IsDisabledThenReadOnly, IsProjectMember,]

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
        filtered_assignees = [x for x in assignees if x in proj_members]

        recipient_list = []
        for assignee in filtered_assignees:
            user_settings = models.Settings.objects.get(user = assignee)
            if user_settings.email_on_card_assignment:
                if assignee.email is not None:
                    recipient_list.append(assignee.email)
        
        card = serializer.save(creator = self.request.user, list = list_obj, assignees = filtered_assignees)

        send_mail(
            subject='A card has been assigned to you.',
            message=f'''Hello,
You have been assigned a card in {card.list.project.name}(project), 
This task is due on {card.due_date}.
For further details, visit: http://localhost:3000/project/{card.list.project.id}/{card.list.id}/{card.id}
                    ''',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=recipient_list,            
        )
        
class CardDetail(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = serializers.cardSerializer
    permission_classes = [IsAuthenticated, IsDisabledThenReadOnly, IsProjectMember, CardPermissons]
    lookup_url_kwarg = 'card_id'
    http_method_names = ['get', 'head', 'patch', 'delete']

    def get_queryset(self):
        list = models.list.objects.get(id = self.kwargs['list_id'])
        return list.card_set
    
    def retrieve(self, request, *args, **kwargs):

        queryset = models.card.objects.all()
        card = generics.get_object_or_404(queryset, pk=kwargs['card_id'])
        project = card.list.project
        serializer = serializers.cardSerializer(card)
        assignees = models.user.objects.filter(user_id__in=serializer.data['assignees'])
        assignees_serializer = serializers.userSerializer(assignees, many=True)
        res_dict = serializer.data
        res_dict['assignees'] = assignees_serializer.data
        res_dict['project'] = project.id
        project_members = serializers.userSerializer(project.members, many = True).data
        res_dict['project_members'] = project_members
        project_creator = serializers.userSerializer(project.creator).data
        res_dict['project_creator'] = project_creator
        return Response(res_dict, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):

        instance = self.get_object()
        old_assignees = instance.assignees.all()
        serializer = self.serializer_class(instance, data=request.data, partial=True)

        if serializer.is_valid():
            try:
                assignees = serializer.validated_data['assignees']
                recipient_list = []
                new_assignees = [e for e in assignees if e not in old_assignees]

                for assignee in new_assignees:
                    user_settings = models.Settings.objects.get(user = assignee)
                    if user_settings.email_on_card_assignment:
                        if assignee.email is not None:
                            recipient_list.append(assignee.email)

                due_date = ''
                try:
                    due_date = serializer.validated_data['due_date']
                except:
                    due_date = instance.due_date


                send_mail(
                    subject='A card has been assigned to you.',
                    message=f'''Hello,
You have been assigned a card in {instance.list.project.name}(project), 
This task is due on {due_date}.
For further details, visit: http://localhost:3000/project/{instance.list.project.id}/{instance.list.id}/{instance.id}
                            ''',
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=recipient_list,            
                )

                return super().partial_update(request, *args, **kwargs)

            except:
                return super().partial_update(request, *args, **kwargs)

        return super().partial_update(request, *args, **kwargs)


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
@authentication_classes([TokenAuthentication,])
@permission_classes([IsAuthenticated])
def dashboard(req):
    """
    Returns list of cards user is assigned
    """
    user_obj = req.user
    cards = user_obj.card_set.all()
    resp = []
    for card in cards:
        project = card.list.project
        serialized = serializers.cardSerializer(card)
        data = serialized.data
        data['project'] = project.id
        resp.append(data)
    return Response(resp, status = status.HTTP_200_OK)

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
