# Generated by Django 5.1.6 on 2025-03-07 08:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        (
            "authentication",
            "0004_performance_profile_remove_machine_manufacturer_and_more",
        ),
    ]

    operations = [
        migrations.DeleteModel(
            name="Performance",
        ),
    ]
