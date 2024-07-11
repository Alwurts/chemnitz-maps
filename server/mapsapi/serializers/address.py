from mapsapi.models import Address
from rest_framework import serializers
from drf_spectacular.utils import extend_schema_serializer


@extend_schema_serializer(
    exclude_fields=("user",),  # schema ignore these fields
)
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"
