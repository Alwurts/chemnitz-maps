from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.contrib.auth.models import User
from rest_framework import status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from mapsapi.serializers.user import UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from rest_framework_simplejwt.views import TokenObtainPairView

from mapsapi.serializers.token import (
    CustomRefreshToken,
    CustomTokenObtainPairSerializer,
)
from mapsapi.models import UserProfile
from drf_spectacular.utils import extend_schema, inline_serializer


@extend_schema(
    operation_id="api_auth_login",
)
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserTypeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        operation_id="api_auth_user_upgrade",
        responses={
            200: inline_serializer(
                name="RefreshTokenResponse",
                fields={
                    "message": serializers.CharField(),
                    "refresh": serializers.CharField(),
                    "access": serializers.CharField(),
                },
            ),
            400: {
                "type": "string",
                "description": "User type upgrade failed.",
            },
        },
    )
    def put(Self, request):
        """
        Upgrade the authenticated user type of the current user to premium
        """
        user = request.user
        if user.is_authenticated:
            try:
                # Access the UserProfile instance
                user_profile = UserProfile.objects.get(user=user)
                user_profile.user_type = "premium"
                user_profile.save()
                refresh = CustomRefreshToken.for_user(user)

                # Return the new refresh token to the client
                return Response(
                    {
                        "message": "User type upgraded. Please refresh your tokens.",
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                    status=status.HTTP_200_OK,
                )
            except UserProfile.DoesNotExist:
                return Response(
                    "User profile does not exist.",
                    status=status.HTTP_400_BAD_REQUEST,
                )
        return Response(status=status.HTTP_401_UNAUTHORIZED)


class UserView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(operation_id="api_auth_profile_get", responses={200: UserSerializer})
    def get(self, request):
        users = User.objects.get(username=request.user.username)
        serializer = UserSerializer(users)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        operation_id="api_auth_profile_update",
        request=inline_serializer(
            name="UserUpdateRequest",
            fields={
                "first_name": serializers.CharField(),
                "last_name": serializers.CharField(),
            },
        ),
        responses={
            200: UserSerializer,
            400: {
                "type": "object",
                "description": "Current password is incorrect.",
            },
        },
    )
    def put(self, request):
        user = User.objects.get(username=request.user.username)
        serializer = UserSerializer(
            user,
            data={
                "first_name": request.data.get("first_name"),
                "last_name": request.data.get("last_name"),
            },
            partial=True,
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        operation_id="api_auth_user_delete",
        responses={
            204: None,
        },
    )
    def delete(self, request):
        user = User.objects.get(username=request.user.username)
        user.is_active = False
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class DeletedUsersView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        operation_id="api_auth_deleted_users",
        responses={
            200: UserSerializer(many=True),
        },
    )
    def get(self, request, format=None):
        """
        Return a list of all soft deleted users.
        """
        deleted_users = User.objects.filter(is_active=False)
        serializer = UserSerializer(deleted_users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserPasswordView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        operation_id="api_auth_password_update",
        request=inline_serializer(
            name="PasswordUpdateRequest",
            fields={
                "old_password": serializers.CharField(),
                "new_password": serializers.CharField(),
                "repeat_new_password": serializers.CharField(),
            },
        ),
        responses={
            200: None,
            400: {
                "type": "string",
                "description": "Current password is incorrect.",
            },
            400: {
                "type": "string",
                "description": "Passwords do not match.",
            },
        },
    )
    def put(self, request):
        """
        Update the authenticated user's password.
        """
        user = User.objects.get(username=request.user.username)
        if not user.check_password(request.data.get("old_password")):
            return Response(
                "Current password is incorrect.",
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not request.data.get("new_password") == request.data.get(
            "repeat_new_password"
        ):
            return Response(
                "Passwords do not match.",
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(request.data.get("new_password"))
        user.save()
        return Response(status=status.HTTP_200_OK)


class SignUpView(APIView):
    @extend_schema(
        operation_id="api_auth_signup",
        request=UserSerializer,
        responses={
            201: UserSerializer,
            400: {
                "type": "object",
                "description": "Errors in the request.",
            },
        },
    )
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data.get("username")
            email = serializer.validated_data.get("email")

            # Check if username or email already exists
            if User.objects.filter(username=username).exists():
                return Response(
                    {"username": ["A user with that username already exists."]},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if User.objects.filter(email=email).exists():
                return Response(
                    {"email": ["A user with that email already exists."]},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Validate email
            try:
                validate_email(email)
            except ValidationError:
                return Response(
                    {"email": ["Invalid email address."]},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Save the user
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
