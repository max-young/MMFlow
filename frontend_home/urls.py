from django.urls import re_path

from . import views

# 与React Router匹配
urlpatterns = [
    re_path(r'^$', views.home_page),
    re_path(r'^(?:(?!api|flow|admin|api-doc|api-auth|docs).*)/?$', views.home_page),
]
