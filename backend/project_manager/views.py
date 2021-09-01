from django.http.response import HttpResponseNotAllowed
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from .param_settings.oauth2_params import auth_params
from .utils.auth_utils import login, logout, login_needed, redirect_if_loggedin
from . import models
import requests

# Create your views here.

def index(req):
    """
    This will become the entry point, with a button to login with channel-i and a checkbox to remember me.
    """
    return HttpResponse("Hello! This is the first page.")

@redirect_if_loggedin('project_manager:after_auth')
def oauth2_redirect(req):
    url = f"https://channeli.in/oauth/authorise/?client_id={auth_params['CLIENT_ID']}&redirect_uri={auth_params['REDIRECT_URI']}&state={auth_params['STATE_STRING']}"
    return HttpResponseRedirect(url)

@redirect_if_loggedin('project_manager:after_auth')
def oauth2_authcode(req):
    parameters = {
        'client_id' : auth_params['CLIENT_ID'],
        'client_secret' : auth_params['CLIENT_SECRET'],
        'grant_type' : 'authorization_code',
        'redirect_uri' : auth_params['REDIRECT_URI'],
        'code' : req.GET.get('code', None),
    }
    res = requests.post(
        "https://channeli.in/open_auth/token/", data=parameters)

    if(res.status_code == 200):
        data = res.json()
        header = {
            "Authorization": "Bearer " + data['access_token']
        }
        null = None
        false = False
        data_res = requests.get(
            "https://channeli.in/open_auth/get_user_data/", headers=header)
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
            login(req, user_obj)
            return HttpResponseRedirect(reverse('project_manager:after_auth'))
        else:
            return HttpResponseNotAllowed('Site is only accessible to channel-i maintainers.')
    else:
        return HttpResponse("Some error occured, try again later")

@login_needed('project_manager:index')
def after_auth(req):
    return HttpResponse("Here after auth")

def logout_view(req):
    return logout(req, 'project_manager:index')
