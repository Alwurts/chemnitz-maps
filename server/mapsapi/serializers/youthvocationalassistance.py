from mapsapi.models import YouthVocationalAssistance
from rest_framework import serializers


class YouthVocationalAssistanceSerializer(serializers.ModelSerializer):
    is_favorite = serializers.BooleanField()
    class Meta:
        model = YouthVocationalAssistance
        fields = "__all__"  # Use all fields from the model
