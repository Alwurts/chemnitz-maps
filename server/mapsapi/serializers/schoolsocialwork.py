from mapsapi.models import SchoolSocialWork
from rest_framework import serializers

class SchoolSocialWorkSerializer(serializers.ModelSerializer):
    is_favorite = serializers.BooleanField()
    class Meta:
        model = SchoolSocialWork
        fields = "__all__"  # Use all fields from the model
