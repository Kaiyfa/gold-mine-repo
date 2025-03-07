# Generated by Django 5.1.6 on 2025-03-06 13:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        (
            "authentication",
            "0002_productionsummary_machine_manufacturer_operator_and_more",
        ),
    ]

    operations = [
        migrations.AddField(
            model_name="machine",
            name="Status",
            field=models.CharField(
                choices=[
                    ("Active", "Active"),
                    ("Inactive", "Inactive"),
                    ("In Maintenance", "In Maintenance"),
                    ("Standby", "Standby"),
                ],
                default="Active",
                max_length=20,
            ),
        ),
    ]
