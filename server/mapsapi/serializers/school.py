from mapsapi.models import School
from rest_framework import serializers


class SchoolSerializer(serializers.ModelSerializer):
    is_favorite = serializers.BooleanField()

    class Meta:
        model = School
        fields = "__all__"  # Use all fields from the model
