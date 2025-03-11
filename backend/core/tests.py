# Create your tests here.
from django.test import TestCase
from core.models import Machine
from django.core.exceptions import ValidationError
from datetime import datetime, timedelta
from django.utils.timezone import now

class MachineTestCase(TestCase):
    """Test suite for the Machine model."""

    def setUp(self):
        """Set up test machines."""
        self.machine = Machine.objects.create(
            name="Excavator 3000",
            manufacturer="Caterpillar",
            model_number="EX-3000",
            purchase_date="2023-01-15",
            status="Available",
            last_maintenance_date=now() - timedelta(days=30),
            downtime_hours=5.0
        )

    def test_machine_status_update(self):
        """Ensure machine status updates correctly."""
        self.machine.status = "Under Maintenance"
        self.machine.save()
        self.assertEqual(self.machine.status, "Under Maintenance")

        self.machine.status = "Available"
        self.machine.save()
        self.assertEqual(self.machine.status, "Available")

    def test_machine_in_stock(self):
        """Check if the machine is available for use."""
        self.assertTrue(self.machine.status == "Available")
        self.machine.status = "Under Maintenance"
        self.assertFalse(self.machine.status == "Available")

    def test_downtime_tracking(self):
        """Ensure downtime hours are correctly updated after maintenance."""
        previous_downtime = self.machine.downtime_hours
        self.machine.update_downtime()  # Custom method in your model
        self.assertGreater(self.machine.downtime_hours, previous_downtime)

    def test_negative_downtime_prevention(self):
        """Prevent machines from having negative downtime."""
        self.machine.downtime_hours = -5
        with self.assertRaises(ValidationError):
            self.machine.full_clean()

    def test_maintenance_time_format(self):
        """Ensure correct datetime format for maintenance records."""
        maintenance_time = "2024-03-10 14:30:00"
        try:
            datetime.strptime(maintenance_time, "%Y-%m-%d %H:%M:%S")
        except ValueError:
            self.fail("Incorrect datetime format!")

    def test_machine_status_transitions(self):
        """Check machine status transitions are valid."""
        valid_statuses = ["Available", "Under Maintenance", "In Use"]
        for status in valid_statuses:
            self.machine.status = status
            self.machine.save()
            self.assertEqual(self.machine.status, status)

        invalid_status = "Broken"
        with self.assertRaises(ValidationError):
            self.machine.status = invalid_status
            self.machine.full_clean()  # This should raise an error

    def test_create_multiple_machines(self):
        """Test if multiple machines can be added and retrieved."""
        Machine.objects.create(
            name="Bulldozer Max",
            manufacturer="Komatsu",
            model_number="BD-500",
            purchase_date="2022-07-22",
            status="Under Maintenance",
            last_maintenance_date=now(),
            downtime_hours=10
        )
        Machine.objects.create(
            name="DrillMaster X",
            manufacturer="Atlas Copco",
            model_number="DMX-100",
            purchase_date="2021-06-18",
            status="Available",
            last_maintenance_date=now(),
            downtime_hours=3
        )

        self.assertEqual(Machine.objects.count(), 3)  # 1 from setUp + 2 new

    def test_valid_machine_entry(self):
        """Ensure valid machine entries pass validation."""
        try:
            self.machine.full_clean()  # This should not raise an error
        except ValidationError:
            self.fail("full_clean() raised ValidationError unexpectedly!")

