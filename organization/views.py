# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
from django.shortcuts import redirect
from django_filters import rest_framework as filters
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import User
from .serializers import UserSerializer


@api_view(['POST'])
@permission_classes([AllowAny, ])
def login_view(request):
    """登录

    post:
    Parameters
    ```json
    {
        "username": "yangle",
        "password": "Yangle123"
    }
    ```
    Reponse
    ```json
    status 200
    {"message": "登陆成功"}
    status 401
    {"message": "账号密码错误"}
    ```
    """
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        return Response({'message': '登陆成功'}, status=status.HTTP_200_OK)
    else:
        return Response({'message': '账号密码错误'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def logout_view(request):
    """退出登录

    get:
    Response
    ```json
    status 200
    {
        "message": "登陆成功"
    }
    ```
    """
    logout(request)
    return Response({'message': '退出成功'}, status=status.HTTP_200_OK)


@api_view(['GET'])
def current_user_view(request):
    """当前登录用户

    get:
    ```json
    status 200
    {
        "id": 1,
        "username": "yangle",
        "first_name": "",
        "email": ""
    }
    status 401
    {"message": "未登录"}
    ```
    """
    current_user = request.user
    if current_user.is_authenticated:
        return Response(UserSerializer(current_user).data, status=status.HTTP_200_OK)
    return Response({'message': '未登录'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([AllowAny, ])
def experience_view(request):
    """首页让游客用已创建用户跳转后台来体验
    """
    # 提前创建好admin这个用户, 并分配好权限
    user = User.objects.get(username='admin')
    login(request, user)
    return redirect('/flow/')


class UserFilter(filters.FilterSet):
    """搜索用户
    """
    like_username_firstname = filters.CharFilter(method='like_username_firstname_filter',
                                                 help_text="匹配username和firstname")

    class Meta:
        model = User
        fields = ['username', 'first_name']

    def like_username_firstname_filter(self, queryset, name, value):
        return queryset.filter(Q(username__contains=value) | Q(first_name__contains=value))


class UserViewSet(viewsets.ModelViewSet):
    """用户

    list:
    Response
    ```json
    {
        "count": 8,
        "next": null,
        "previous": null,
        "results": [
            {
                "id": 1,
                "username": "yangle",
                "first_name": "",
                "email": ""
            },
            ...
        ]
    }
    ```

    create:
    Parameters
    ```json
    {
        "username": "wonda"
    }
    ```
    Response
    ```json
    {
        "id": 9,
        "username": "wonda",
        "first_name": "",
        "email": ""
    }
    ```
    """
    serializer_class = UserSerializer
    queryset = User.objects.all()
    filterset_class = UserFilter
