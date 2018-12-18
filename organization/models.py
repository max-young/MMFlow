# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractUser


class Company(models.Model):
    """公司信息
    """
    name = models.CharField('company name', max_length=50)

    def __str__(self):
        return self.name


class User(AbstractUser):
    """用户信息

    subclass AbstractUser, 保留内置User的所有信息和功能, 但是可以额外增加字段信息
    """
    company = models.ForeignKey(Company, on_delete=models.PROTECT, null=True)

    USERNAME_FIELD = 'username'

    def __str__(self):
        return self.username

    def is_admin(self):
        return self.groups.filter(name='admin').exists()
