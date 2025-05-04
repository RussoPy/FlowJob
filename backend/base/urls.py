from django.urls import path 
from .views import index
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkerViewSet, JobViewSet


router = DefaultRouter()
router.register(r'workers', WorkerViewSet, basename='workers')
router.register(r'jobs', JobViewSet, basename='jobs')


urlpatterns = [
     path('', include(router.urls)),
]
