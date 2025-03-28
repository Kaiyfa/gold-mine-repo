# Generated by Django 5.1.6 on 2025-03-07 07:38

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Machine",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("Active", "Active"),
                            ("Inactive", "Inactive"),
                            ("In Maintenance", "In Maintenance"),
                        ],
                        max_length=20,
                    ),
                ),
                ("manufacturer", models.CharField(max_length=100)),
                ("model_number", models.CharField(max_length=100)),
                ("type", models.CharField(max_length=100)),
                ("purchase_date", models.DateField()),
            ],
            options={
                "db_table": "core_machine",
            },
        ),
        migrations.CreateModel(
            name="Maintenance",
            fields=[
                ("MaintenanceID", models.AutoField(primary_key=True, serialize=False)),
                ("MaintenanceDate", models.DateField()),
                (
                    "IssueReported",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                (
                    "MaintenanceCost",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=10, null=True
                    ),
                ),
                ("description", models.TextField(default="No description provided")),
                (
                    "Machine",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="core.machine"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Technician",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("specialization", models.CharField(max_length=100)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
