# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm

from .models import Company, User


class MyUserChangeForm(UserChangeForm):

    class Meta(UserChangeForm.Meta):
        model = User


class MyUserAdmin(UserAdmin):
    """自定义用户admin

    https://stackoverflow.com/questions/15012235/using-django-auth-useradmin-for-a-custom-user-model
    在编辑用户页面上增加company表单
    """
    form = MyUserChangeForm

    fieldsets = UserAdmin.fieldsets + (
        ('自定义字段', {'fields': ('company',)}),
    )


admin.site.register(User, MyUserAdmin)
admin.site.register(Company)
