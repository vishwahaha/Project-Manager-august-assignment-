# Generated by Django 3.2.6 on 2021-09-01 22:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('project_manager', '0004_user_last_login'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='last_login',
        ),
    ]