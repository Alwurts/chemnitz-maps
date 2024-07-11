import json
import requests
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime

from mapsapi.models import (
    School,
    Kindergarden,
    SchoolSocialWork,
    YouthVocationalAssistance,
)


class Command(BaseCommand):
    help = "Import data from GeoJSON API"

    def handle(self, *args, **kwargs):
        api_urls = {
            "school": "https://services6.arcgis.com/jiszdsDupTUO3fSM/arcgis/rest/services/Schulen_OpenData/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson",
            "kindergarden": "https://services6.arcgis.com/jiszdsDupTUO3fSM/arcgis/rest/services/Kindertageseinrichtungen_Sicht/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson",
            "school_social_work": "https://services6.arcgis.com/jiszdsDupTUO3fSM/arcgis/rest/services/Schulsozialarbeit_FL_1/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson",
            "youth_vocational_assistance": "https://services6.arcgis.com/jiszdsDupTUO3fSM/arcgis/rest/services/Jugendberufshilfen_FL_1/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson",
        }

        for model_name, api_url in api_urls.items():
            try:
                response = requests.get(api_url)
                response.raise_for_status()
                data = response.json()
            except requests.RequestException as e:
                self.stderr.write(f"Error fetching data for {model_name}: {e}")
                continue

            if data["type"] == "FeatureCollection":
                for feature in data["features"]:
                    properties = feature["properties"]
                    coordinates = feature["geometry"]["coordinates"]

                    if model_name == "school":
                        self.import_school(properties, coordinates)
                    elif model_name == "kindergarden":
                        self.import_kindergarden(properties, coordinates)
                    elif model_name == "school_social_work":
                        self.import_school_social_work(properties, coordinates)
                    elif model_name == "youth_vocational_assistance":
                        self.import_youth_vocational_assistance(properties, coordinates)

    def import_school(self, properties, coordinates):
        school, created = School.objects.update_or_create(
            id=properties["ID"],
            defaults={
                "category": properties["ART"],
                "category_code": properties["TYP"],
                "name": properties["BEZEICHNUNG"],
                "short_name": properties["KURZBEZEICHNUNG"],
                "additional_name": properties["BEZEICHNUNGZUSATZ"],
                "street": properties["STRASSE"],
                "postal_code": properties["PLZ"],
                "city": properties["ORT"],
                "phone": properties["TELEFON"],
                "fax": properties["FAX"],
                "email": properties["EMAIL"],
                "website": properties["WWW"],
                "sponsor": properties["TRAEGER"],
                "sponsor_code": properties["TRAEGERTYP"],
                "latitude": coordinates[1],
                "longitude": coordinates[0],
            },
        )
        self.stdout.write(
            self.style.SUCCESS(
                f"{'Created' if created else 'Updated'} school: {school.name}"
            )
        )

    def import_kindergarden(self, properties, coordinates):
        kindergarden, created = Kindergarden.objects.update_or_create(
            id=properties["ID"],
            defaults={
                "sponsor": properties["TRAEGER"],
                "name": properties["BEZEICHNUNG"],
                "short_name": properties["KURZBEZEICHNUNG"],
                "street": properties["STRASSE"],
                "house_number": properties["HAUSBEZ"],
                "postal_code": properties["PLZ"],
                "city": properties["ORT"],
                "url": properties["URL"],
                "phone": properties["TELEFON"],
                "fax": properties["FAX"],
                "email": properties["EMAIL"],
                "latitude": coordinates[1],
                "longitude": coordinates[0],
            },
        )
        self.stdout.write(
            self.style.SUCCESS(
                f"{'Created' if created else 'Updated'} kindergarden: {kindergarden.name}"
            )
        )

    def import_school_social_work(self, properties, coordinates):
        school_social_work, created = SchoolSocialWork.objects.update_or_create(
            id=properties["ID"],
            defaults={
                "sponsor": properties["TRAEGER"],
                "services": properties["LEISTUNGEN"],
                "street": properties["STRASSE"],
                "postal_code": properties["PLZ"],
                "city": properties["ORT"],
                "phone": properties.get("TELEFON", None),
                "fax": properties["FAX"],
                "email": properties.get("EMAIL", None),
                "website": properties.get("WWW", None),
                "latitude": coordinates[1],
                "longitude": coordinates[0],
            },
        )
        self.stdout.write(
            self.style.SUCCESS(
                f"{'Created' if created else 'Updated'} school social work: {school_social_work.street}"
            )
        )

    def import_youth_vocational_assistance(self, properties, coordinates):
        youth_vocational_assistance, created = (
            YouthVocationalAssistance.objects.update_or_create(
                id=properties["ID"],
                defaults={
                    "sponsor": properties["TRAEGER"],
                    "services": properties["LEISTUNGEN"],
                    "street": properties["STRASSE"],
                    "postal_code": properties["PLZ"],
                    "city": properties["ORT"],
                    "phone": properties.get("TELEFON", None),
                    "fax": properties["FAX"],
                    "email": properties.get("EMAIL", None),
                    "website": properties.get("WWW", None),
                    "latitude": coordinates[1],
                    "longitude": coordinates[0],
                },
            )
        )
        self.stdout.write(
            self.style.SUCCESS(
                f"{'Created' if created else 'Updated'} youth vocational assistance: {youth_vocational_assistance.street}"
            )
        )
