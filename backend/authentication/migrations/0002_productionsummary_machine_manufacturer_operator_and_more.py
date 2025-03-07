# Generated by Django 5.1.6 on 2025-03-06 11:04

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ProductionSummary",
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
                ("ModelNumber", models.CharField(max_length=50)),
                ("Shift", models.CharField(max_length=50)),
                ("TotalProduction", models.IntegerField()),
            ],
            options={
                "db_table": "productionsummary",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Machine",
            fields=[
                ("MachineID", models.AutoField(primary_key=True, serialize=False)),
                ("ModelNumber", models.CharField(max_length=50)),
                ("Type", models.CharField(blank=True, max_length=50, null=True)),
                ("PurchaseDate", models.DateField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name="Manufacturer",
            fields=[
                ("ManufacturerID", models.AutoField(primary_key=True, serialize=False)),
                ("Name", models.CharField(max_length=100)),
                ("Country", models.CharField(blank=True, max_length=50, null=True)),
                (
                    "ContactDetails",
                    models.CharField(blank=True, max_length=150, null=True),
                ),
                ("YearEstablished", models.IntegerField(blank=True, null=True)),
                (
                    "CertificationLevel",
                    models.CharField(
                        choices=[
                            ("ISO 9001", "ISO 9001"),
                            ("ISO 14001", "ISO 14001"),
                            ("Other", "Other"),
                        ],
                        default="Other",
                        max_length=50,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Operator",
            fields=[
                ("OperatorID", models.AutoField(primary_key=True, serialize=False)),
                ("Name", models.CharField(max_length=100)),
                (
                    "ContactDetails",
                    models.CharField(blank=True, max_length=150, null=True),
                ),
                (
                    "Role",
                    models.CharField(
                        choices=[
                            ("Technician", "Technician"),
                            ("Supervisor", "Supervisor"),
                            ("Manager", "Manager"),
                        ],
                        max_length=50,
                    ),
                ),
            ],
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
                (
                    "Machine",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="authentication.machine",
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="machine",
            name="Manufacturer",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="authentication.manufacturer",
            ),
        ),
        migrations.CreateModel(
            name="PurchaseHistory",
            fields=[
                ("PurchaseID", models.AutoField(primary_key=True, serialize=False)),
                ("Vendor", models.CharField(blank=True, max_length=100, null=True)),
                ("PurchaseDate", models.DateField()),
                (
                    "Amount",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=10, null=True
                    ),
                ),
                ("WarrantyExpiry", models.DateField(blank=True, null=True)),
                (
                    "PurchaseMethod",
                    models.CharField(
                        choices=[
                            ("Cash", "Cash"),
                            ("Credit", "Credit"),
                            ("Leasing", "Leasing"),
                        ],
                        max_length=50,
                    ),
                ),
                (
                    "Machine",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="authentication.machine",
                    ),
                ),
            ],
        ),
    ]
