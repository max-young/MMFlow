from django.urls import re_path

from . import views

# 与React Router匹配
urlpatterns = [
    re_path(r'^flow$', views.flow),
    re_path(r'^flow/(?:.*)/?$', views.flow),
]
