# Generated by Django 5.0.7 on 2024-07-11 15:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mapsapi', '0002_alter_school_fax_alter_school_phone'),
    ]

    operations = [
        migrations.AlterField(
            model_name='schoolsocialwork',
            name='fax',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='schoolsocialwork',
            name='phone',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='youthvocationalassistance',
            name='fax',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='youthvocationalassistance',
            name='phone',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]