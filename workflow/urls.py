from . import views
from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'flow-template', views.FlowTemplateView, base_name='flowtemplate')
router.register(r'process', views.ProcessView, base_name='process')

urlpatterns = []
urlpatterns += router.urls
