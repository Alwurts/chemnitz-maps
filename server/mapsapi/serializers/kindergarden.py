from mapsapi.models import Kindergarden
from rest_framework import serializers

class KindergardenSerializer(serializers.ModelSerializer):
    is_favorite = serializers.BooleanField()
    
    class Meta:
        model = Kindergarden
        fields = "__all__"  # Use all fields from the model
