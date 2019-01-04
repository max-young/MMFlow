from django.urls import path
from rest_framework import routers

from . import views

router = routers.SimpleRouter()
router.register(r'user', views.UserViewSet, base_name='user')
urlpatterns = [
    path('login/', views.login_view),
    path('logout/', views.logout_view),
    path('current-user/', views.current_user_view),
    path('experience/', views.experience_view)
]
urlpatterns += router.urls
