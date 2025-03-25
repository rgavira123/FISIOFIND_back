# Generated by Django 5.1.6 on 2025-03-25 18:14

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Appointment',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('start_time', models.DateTimeField(verbose_name='start_time')),
                ('end_time', models.DateTimeField(verbose_name='end_time')),
                ('is_online', models.BooleanField(verbose_name='is_online')),
                ('service', models.JSONField(verbose_name='service')),
                ('status', models.CharField(choices=[('finished', 'Finished'), ('confirmed', 'Confirmed'), ('canceled', 'Canceled'), ('booked', 'Booked'), ('pending', 'Pending')], default='booked', max_length=50, verbose_name='status')),
                ('alternatives', models.JSONField(blank=True, null=True, verbose_name='alternatives')),
            ],
            options={
                'verbose_name': 'Appointment',
                'verbose_name_plural': 'Appointment',
            },
        ),
    ]
