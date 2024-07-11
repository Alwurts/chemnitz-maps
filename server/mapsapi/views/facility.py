from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from mapsapi.models import (
    School,
    Kindergarden,
    YouthVocationalAssistance,
    SchoolSocialWork,
    Favorite,
)
from mapsapi.serializers.school import SchoolSerializer
from mapsapi.serializers.kindergarden import KindergardenSerializer
from mapsapi.serializers.youthvocationalassistance import (
    YouthVocationalAssistanceSerializer,
)
from mapsapi.serializers.facility import PublicFacilitiesSerializer
from mapsapi.serializers.schoolsocialwork import SchoolSocialWorkSerializer
from rest_framework.exceptions import NotFound
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from drf_spectacular.utils import extend_schema

from django.contrib.contenttypes.models import ContentType
from django.db.models import Exists, OuterRef, Value

from django.utils import timezone
from django.conf import settings
from datetime import timedelta

class PublicFacilitiesView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    @extend_schema(
        operation_id="api_public_facilities",
        responses={
            200: PublicFacilitiesSerializer,
            404: None,
        },
    )
    def get(self, request, type=None, pk=None):
        """
        Retrieve lists of all public facilities.
        """
        self.check_and_update_data()

        user = request.user
        facility_models = [
            ("school", School, SchoolSerializer),
            ("kindergarden", Kindergarden, KindergardenSerializer),
            ("school_social_work", SchoolSocialWork, SchoolSocialWorkSerializer),
            (
                "youth_vocational_assistance",
                YouthVocationalAssistance,
                YouthVocationalAssistanceSerializer,
            ),
        ]
        facilities = {}

        for type, model, serializer_class in facility_models:
            content_type = ContentType.objects.get_for_model(model)

            if user.is_authenticated:
                favorites_subquery = Favorite.objects.filter(
                    user=user,
                    facility_type=content_type,
                    facility_id=OuterRef("pk"),
                )
                annotated_queryset = model.objects.annotate(
                    is_favorite=Exists(favorites_subquery)
                )
            else:
                annotated_queryset = model.objects.annotate(is_favorite=Value(False))

            serializer = serializer_class(annotated_queryset, many=True)
            facilities[type] = serializer.data

        return Response(
            facilities,
            status=status.HTTP_200_OK,
        )

    def check_and_update_data(self):
        last_update = getattr(settings, 'LAST_DATA_UPDATE', None)
        update_interval = getattr(settings, 'DATA_UPDATE_INTERVAL', timedelta(days=1))
        print(f"Last update: {last_update}")
        print(f"Update interval: {update_interval}")
        if not last_update or timezone.now() - last_update > update_interval:
            print("Updating data")
            self.update_data()

    def update_data(self):
        try: 
            # Call your data import function here
            from django.core.management import call_command
            call_command('import_chemnitz_data')
        
            # Update the last update time
            settings.LAST_DATA_UPDATE = timezone.now()
        except Exception as e:
            print(f"Error updating data: {str(e)}")

def get_facility_detail(request, id, serializer, model):
    """
    Retrieve a specific public facility detail.
    """

    db_model_type = ContentType.objects.get_for_model(model)

    if request.user.is_authenticated:
        favorites_subquery = Favorite.objects.filter(
            user=request.user, facility_type=db_model_type, facility_id=OuterRef("pk")
        )

        facility = (
            model.objects.annotate(is_favorite=Exists(favorites_subquery))
            .filter(pk=id)
            .first()
        )
    else:
        facility = (
            model.objects.annotate(is_favorite=Value(False)).filter(pk=id).first()
        )

    if not facility:
        raise NotFound(f"{type.capitalize()} not found")

    serializer = serializer(facility)
    return Response(serializer.data)


@extend_schema(responses={200: SchoolSerializer})
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def get_school(request, pk):
    return get_facility_detail(request, pk, SchoolSerializer, School)


@extend_schema(responses={200: KindergardenSerializer})
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def get_kindergarden(request, pk):
    return get_facility_detail(request, pk, KindergardenSerializer, Kindergarden)


@extend_schema(responses={200: YouthVocationalAssistanceSerializer})
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def get_youth_vocational_assistance(request, pk):
    return get_facility_detail(
        request, pk, YouthVocationalAssistanceSerializer, YouthVocationalAssistance
    )


@extend_schema(responses={200: SchoolSocialWorkSerializer})
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
def get_school_social_work(request, pk):
    return get_facility_detail(
        request, pk, SchoolSocialWorkSerializer, SchoolSocialWork
    )


class PublicFacilityFavoriteView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        operation_id="api_public_facilities_favorite",
    )
    def post(self, request, type, pk):
        """
        Add a facility to the user's favorites.
        """
        user = request.user

        if type == "school":
            model_type = ContentType.objects.get_for_model(School)
        elif type == "kindergarden":
            model_type = ContentType.objects.get_for_model(Kindergarden)
        elif type == "youth_vocational_assistance":
            model_type = ContentType.objects.get_for_model(YouthVocationalAssistance)
        elif type == "school_social_work":
            model_type = ContentType.objects.get_for_model(SchoolSocialWork)

        try:
            favorite = Favorite.objects.get(
                user=user, facility_type=model_type, facility_id=pk
            )

            if favorite:
                favorite.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
        except Favorite.DoesNotExist:
            user_profile = user.userprofile
            if user_profile.user_type == "basic":
                favorites_count = Favorite.objects.filter(user=user).count()
                if favorites_count >= 1:
                    return Response(
                        "Basic users can only have a maximum of 1 favorite.",
                        status=status.HTTP_403_FORBIDDEN,
                    )

            Favorite.objects.create(user=user, facility_type=model_type, facility_id=pk)

        return Response(status=status.HTTP_200_OK)
