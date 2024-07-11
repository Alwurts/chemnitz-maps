from mapsapi.serializers.school import SchoolSerializer
from mapsapi.serializers.kindergarden import KindergardenSerializer
from mapsapi.serializers.schoolsocialwork import SchoolSocialWorkSerializer
from mapsapi.serializers.youthvocationalassistance import (
    YouthVocationalAssistanceSerializer,
)
from rest_framework import serializers


class PublicFacilitiesSerializer(serializers.Serializer):
    school = SchoolSerializer(many=True)
    kindergarden = KindergardenSerializer(many=True)
    youth_vocational_assistance = YouthVocationalAssistanceSerializer(many=True)
    school_social_work = SchoolSocialWorkSerializer(many=True)
