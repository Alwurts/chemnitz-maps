from django.apps import AppConfig


class MapsapiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "mapsapi"

    def ready(self):
        import mapsapi.signals
