from django.http import HttpResponseRedirect
from django.urls import reverse

def login(req, user_obj):
    req.session['is_loggedin'] = True
    req.session['user_id'] = user_obj.user_id

def logout(req, redirect_url):
    req.session.flush()
    return HttpResponseRedirect(reverse(redirect_url))

def login_needed(redirect_url): 
    def outer(func):
        def inner(req, *args, **kwargs):
            try:
                if req.session['is_loggedin'] == True:
                    return func(req, *args, **kwargs)
            except:
                return HttpResponseRedirect(reverse(redirect_url))
        return inner
    return outer

def redirect_if_loggedin(redirect_url): 
    def outer(func):
        def inner(req, *args, **kwargs):
            try:
                if req.session['is_loggedin'] == True:
                    return HttpResponseRedirect(reverse(redirect_url))
            except:
                return func(req, *args, **kwargs)
        return inner
    return outer
