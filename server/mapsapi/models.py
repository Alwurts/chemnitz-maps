import uuid
from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class UserProfile(models.Model):
    USER_TYPE_CHOICES = (
        ("basic", "Basic"),
        ("premium", "Premium"),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_type = models.CharField(
        max_length=10, choices=USER_TYPE_CHOICES, default="basic"
    )

    def __str__(self):
        return self.user.username


class Favorite(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    facility_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    facility_id = models.PositiveIntegerField()
    facility = GenericForeignKey("facility_type", "facility_id")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "facility_type", "facility_id")

    def __str__(self):
        return f"{self.user.username} likes {self.facility}"


class Address(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")
    longitude = models.FloatField()
    latitude = models.FloatField()
    label = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Address"
        verbose_name_plural = "Addresses"
        db_table = "mapsapi_address"
        unique_together = ("user", "label")

    def __str__(self):
        return f"{self.user.username} - {self.latitude}, {self.longitude}"


class School(models.Model):
    id = models.IntegerField(primary_key=True)  # ID
    type = models.CharField(
        max_length=255, default="school"
    )  # TYP (Schule, Berufsschule, etc.
    category = models.CharField(max_length=255)  # ART
    category_code = models.CharField(max_length=255, null=True, blank=True)  # TYP
    name = models.CharField(max_length=255)  # BEZEICHNUNG
    short_name = models.CharField(max_length=255)  # KURZBEZEICHNUNG
    additional_name = models.CharField(
        max_length=255, null=True, blank=True
    )  # BEZEICHNUNGZUSATZ
    street = models.CharField(max_length=255)  # STRASSE
    postal_code = models.CharField(max_length=10)  # PLZ
    city = models.CharField(max_length=255)  # ORT
    phone = models.CharField(max_length=50)  # TELEFON
    fax = models.CharField(max_length=50, null=True, blank=True)  # FAX
    email = models.EmailField(null=True, blank=True)  # EMAIL
    website = models.URLField(null=True, blank=True)  # WWW
    sponsor = models.CharField(max_length=255, null=True, blank=True)  # TRAEGER
    sponsor_code = models.IntegerField(null=True, blank=True)  # TRAEGERTYP
    latitude = models.FloatField()
    longitude = models.FloatField()

    class Meta:
        verbose_name = "School"
        verbose_name_plural = "Schools"
        db_table = "mapsapi_school"

    def __str__(self):
        return self.name


class Kindergarden(models.Model):
    id = models.IntegerField(primary_key=True)  # ID
    type = models.CharField(max_length=255, default="kindergarden")
    sponsor = models.CharField(max_length=50, null=True, blank=True)  # TRAEGER
    name = models.CharField(max_length=100, null=True, blank=True)  # BEZEICHNUNG
    short_name = models.CharField(
        max_length=100,
        null=True,
        blank=True,
    )  # KURZBEZEICHNUNG
    street = models.CharField(max_length=24, null=True, blank=True)  # STRASSE
    house_number = models.CharField(max_length=5, null=True, blank=True)  # HAUSBEZ
    postal_code = models.CharField(max_length=50, null=True, blank=True)  # PLZ
    city = models.CharField(max_length=50, null=True, blank=True)  # ORT
    url = models.CharField(max_length=255, null=True, blank=True)  # URL
    phone = models.CharField(max_length=255, null=True, blank=True)  # TELEFON
    fax = models.CharField(max_length=50, null=True, blank=True)  # FAX
    email = models.CharField(max_length=50, null=True, blank=True)  # EMAIL
    latitude = models.FloatField()
    longitude = models.FloatField()

    class Meta:
        verbose_name = "Kindergarden"
        verbose_name_plural = "Kindergardens"
        db_table = "mapsapi_kindergarden"

    def __str__(self):
        return self.name


class SchoolSocialWork(models.Model):
    id = models.IntegerField(primary_key=True)  # ID
    type = models.CharField(max_length=255, default="school_social_work")
    sponsor = models.CharField(max_length=255, null=True, blank=True)  # TRAEGER
    services = models.CharField(max_length=255, null=True, blank=True)  # LEISTUNGEN
    street = models.CharField(max_length=255)  # STRASSE
    postal_code = models.CharField(max_length=10)  # PLZ
    city = models.CharField(max_length=255)  # ORT
    phone = models.CharField(max_length=50, null=True, blank=True)  # TELEFON
    fax = models.CharField(max_length=50, null=True, blank=True)  # FAX
    email = models.EmailField(null=True, blank=True)  # EMAIL
    website = models.URLField(null=True, blank=True)  # WWW
    latitude = models.FloatField()
    longitude = models.FloatField()

    class Meta:
        verbose_name = "School Social Work"
        verbose_name_plural = "School Social Works"
        db_table = "mapsapi_school_social_work"

    def __str__(self):
        return self.services + " - " + self.street


class YouthVocationalAssistance(models.Model):
    id = models.IntegerField(primary_key=True)  # ID
    type = models.CharField(max_length=255, default="youth_vocational_assistance")
    sponsor = models.CharField(max_length=255, null=True, blank=True)  # TRAEGER
    services = models.CharField(max_length=255, null=True, blank=True)  # LEISTUNGEN
    street = models.CharField(max_length=255)  # STRASSE
    postal_code = models.CharField(max_length=10)  # PLZ
    city = models.CharField(max_length=255)  # ORT
    phone = models.CharField(max_length=50, null=True, blank=True)  # TELEFON
    fax = models.CharField(max_length=50, null=True, blank=True)  # FAX
    email = models.EmailField(null=True, blank=True)  # EMAIL
    website = models.URLField(null=True, blank=True)  # WWW
    latitude = models.FloatField()
    longitude = models.FloatField()

    class Meta:
        verbose_name = "Youth Vocational Assistance"
        verbose_name_plural = "Youth Vocational Assistances"
        db_table = "mapsapi_youth_vocational_assistance"

    def __str__(self):
        return self.services + " - " + self.street
