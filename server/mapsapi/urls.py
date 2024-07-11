from django.urls import path, include
from django.shortcuts import render
from rest_framework.routers import DefaultRouter
from .views.facility import (
    PublicFacilitiesView,
    PublicFacilityFavoriteView,
    get_school,
    get_kindergarden,
    get_school_social_work,
    get_youth_vocational_assistance,
)
from .views.address import UserAddressesViewSet
from .views.auth import (
    CustomTokenObtainPairView,
    SignUpView,
    UserPasswordView,
    DeletedUsersView,
    UserView,
    UserTypeView,
)
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)


def custom_redoc_view(request):
    return render(request, "redoc.html")


router = DefaultRouter()
router.register(r"addresses", UserAddressesViewSet, basename="user-addresses")

urlpatterns = [
    # Public facilities list
    path(
        "public-facilities/", PublicFacilitiesView.as_view(), name="public-facilities"
    ),
    # Public facilities detail
    path(
        "public-facilities/school/<int:pk>/",
        get_school,
        name="public-facility-detail-school",
    ),
    path(
        "public-facilities/kindergarden/<int:pk>/",
        get_kindergarden,
        name="public-facility-detail-kindergarden",
    ),
    path(
        "public-facilities/school_social_work/<int:pk>/",
        get_school_social_work,
        name="public-facility-detail-school-social-work",
    ),
    path(
        "public-facilities/youth_vocational_assistance/<int:pk>/",
        get_youth_vocational_assistance,
        name="public-facility-detail-youth-vocational-assistance",
    ),
    # Public facilities favorite
    path(
        "public-facilities/<str:type>/<int:pk>/like",
        PublicFacilityFavoriteView.as_view(),
        name="like-public-facility",
    ),
    # Authentication
    path("auth/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/signup", SignUpView.as_view(), name="signup"),
    path("auth/deleted-users", DeletedUsersView.as_view(), name="deleted-users"),
    # User profile
    path("auth/profile", UserView.as_view(), name="profile"),
    path("auth/upgrade", UserTypeView.as_view(), name="upgrade"),
    path("auth/password", UserPasswordView.as_view(), name="password"),
    # User address
    path("", include(router.urls)),
    # Docs
    # DRF Spectacular API documentation
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    # path(
    #     "docs/",
    #     SpectacularSwaggerView.as_view(url_name="schema"),
    #     name="swagger-ui",
    # ),
    # path("redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    # path("redoc2/", custom_redoc_view, name="custom-redoc"),
]
