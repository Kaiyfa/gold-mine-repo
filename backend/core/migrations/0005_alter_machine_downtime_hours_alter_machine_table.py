# Generated by Django 5.1.6 on 2025-03-10 16:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        (
            "core",
            "0004_rename_maintenance_end_time_machine_last_maintenance_date_and_more",
        ),
    ]

    operations = [
        migrations.AlterField(
            model_name="machine",
            name="downtime_hours",
            field=models.FloatField(default=0),
        ),
        migrations.AlterModelTable(
            name="machine",
            table=None,
        ),
    ]
