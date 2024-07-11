from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes

from mapsapi.serializers.address import AddressSerializer
from mapsapi.models import Address


class UserAddressesViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        operation_id="api_user_addresses_list",
        responses={200: AddressSerializer(many=True)},
    )
    def list(self, request):
        """
        List the addresses of the authenticated user.
        """
        user = request.user
        addresses = user.addresses.all()
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data)

    @extend_schema(
        operation_id="api_user_addresses_get",
        parameters=[
            OpenApiParameter(
                "id",
                OpenApiTypes.NUMBER,
                OpenApiParameter.PATH,
                description="The id of the address to retrieve",
            ),  # path variable was overridden
        ],
        responses={
            200: AddressSerializer,
            404: {
                "type": "string",
                "description": "Address not found",
            },
        },
    )
    def retrieve(self, request, pk=None):
        """
        Retrieve an address of the authenticated user.
        """
        user = request.user
        try:
            address = user.addresses.get(pk=pk)
            serializer = AddressSerializer(address)
            return Response(serializer.data)
        except Address.DoesNotExist:
            return Response("Address not found.", status=status.HTTP_404_NOT_FOUND)

    @extend_schema(
        operation_id="api_user_addresses_create",
        request=AddressSerializer,
        responses={
            201: AddressSerializer,
            403: {
                "type": "string",
                "description": "Basic users can only have one address",
            },
            400: {
                "type": "object",
                "description": "Create address error",
            },
        },
    )
    def create(self, request):
        """
        Create a new address for the authenticated user.
        """
        user = request.user
        user_profile = user.userprofile

        if user_profile.user_type == "basic":
            address_count = Address.objects.filter(user=user).count()
            if address_count >= 1:
                return Response(
                    "Basic users can only have one address.",
                    status=status.HTTP_403_FORBIDDEN,
                )

        data = request.data.copy()
        data["user"] = user.id

        serializer = AddressSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        operation_id="api_user_addresses_update",
        parameters=[
            OpenApiParameter(
                "id",
                OpenApiTypes.NUMBER,
                OpenApiParameter.PATH,
                description="The id of the address to update",
            ),
        ],
        request=AddressSerializer,
        responses={
            200: AddressSerializer,
            404: {
                "type": "string",
                "description": "Address not found",
            },
            400: {
                "type": "object",
                "description": "Update address error",
            },
        },
    )
    def update(self, request, pk=None):
        """
        Update the details of a authenticated user's address.
        """
        user = request.user
        try:
            address = user.addresses.get(pk=pk)
            data = request.data.copy()
            data["user"] = user.id

            serializer = AddressSerializer(
                address,
                data=data,
                partial=True,
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Address.DoesNotExist:
            return Response("Address not found.", status=status.HTTP_404_NOT_FOUND)

    @extend_schema(
        operation_id="api_user_addresses_delete",
        responses={
            204: None,
            404: {
                "type": "string",
                "description": "Address not found",
            },
            403: {
                "type": "string",
                "description": "You cannot delete your last address",
            },
        },
    )
    def destroy(self, request, pk=None):
        """
        Delete an authenticated user's address.
        """
        user = request.user
        try:
            address_count = Address.objects.filter(user=user).count()
            if address_count <= 1:
                return Response(
                    "You cannot delete your last address.",
                    status=status.HTTP_403_FORBIDDEN,
                )

            address = user.addresses.get(pk=pk)
            address.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Address.DoesNotExist:
            return Response("Address not found.", status=status.HTTP_404_NOT_FOUND)
