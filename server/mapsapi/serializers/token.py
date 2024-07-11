from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken


class CustomRefreshToken(RefreshToken):
    @classmethod
    def for_user(cls, user):
        token = super().for_user(user)

        # Add custom claims
        token["user_type"] = (
            user.userprofile.user_type if hasattr(user, "userprofile") else None
        )

        return token


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["user_type"] = (
            user.userprofile.user_type if hasattr(user, "userprofile") else None
        )

        return token
