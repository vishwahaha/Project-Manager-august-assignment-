from django.contrib import admin
from . import models

# Register your models here.

admin.site.register(models.user)
admin.site.register(models.project)
admin.site.register(models.list)
admin.site.register(models.card)
admin.site.register(models.comment)