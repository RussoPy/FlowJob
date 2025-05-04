from rest_framework import serializers
from .models import Worker, Job

class WorkerSerializer(serializers.Serializer):
    name = serializers.CharField()
    age = serializers.IntegerField()
    location_lat = serializers.FloatField()
    location_lng = serializers.FloatField()
    preferred_tags = serializers.ListField(child=serializers.CharField())
    experience_level = serializers.CharField()
    skills = serializers.ListField(child=serializers.CharField())
    profile_photo = serializers.URLField()
    cv_url = serializers.URLField(required=False, allow_null=True)
    availability = serializers.BooleanField()
    profile_score = serializers.IntegerField(required=False)
    swipe_stats = serializers.DictField(required=False)

class JobSerializer(serializers.Serializer):
    title = serializers.CharField()
    description = serializers.CharField()
    tags = serializers.ListField(child=serializers.CharField())
    experience_required = serializers.CharField()
    skills_needed = serializers.ListField(child=serializers.CharField())
    location_lat = serializers.FloatField()
    location_lng = serializers.FloatField()
    salary_min = serializers.FloatField()
    salary_max = serializers.FloatField()
    business_id = serializers.CharField()