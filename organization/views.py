# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
from django_filters import rest_framework as filters
from rest_framework import viewsets, status
from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import User
from .serializers import UserSerializer


# @require_POST
# def login_view(request):
#     """登录
#     """
#     username = request.POST.get('username')
#     password = request.POST.get('password')
#     user = authenticate(request, username=username, password=password)
#     if user:
#         login(request, user)
#         return JsonResponse({'message': 'login success'}, status=200)
#     else:
#         return JsonResponse({'message': '账号密码错误'}, status=401)
#
#
# @require_GET
# def logout_view(request):
#     """登出用户
#     """
#     logout(request)
#     return JsonResponse({'message': '登出成功'}, status=200)
#
#
# @require_GET
# def current_user_view(request):
#     """当前登录用户
#     """
#     current_user = request.user
#     if current_user.is_authenticated:
#         return JsonResponse(UserSerializer(current_user).data, status=200)
#     return Http404()


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
