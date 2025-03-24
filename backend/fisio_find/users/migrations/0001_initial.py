# Generated by Django 5.1.6 on 2025-03-24 19:36

import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Specialization',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='AppUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('photo', models.ImageField(blank=True, null=True, upload_to='profile_photos/')),
                ('dni', models.CharField(max_length=9, unique=True)),
                ('phone_number', models.CharField(max_length=9)),
                ('postal_code', models.CharField(max_length=5)),
                ('account_status', models.CharField(choices=[('ACTIVE', 'Active'), ('BANNED', 'Banned'), ('REMOVED', 'Removed')], default='ACTIVE', max_length=10)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='admin', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')], max_length=1)),
                ('birth_date', models.DateField()),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='patient', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Physiotherapist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bio', models.TextField(blank=True, null=True)),
                ('autonomic_community', models.CharField(choices=[('ANDALUCIA', 'Andalucía'), ('ARAGON', 'Aragón'), ('ASTURIAS', 'Asturias'), ('BALEARES', 'Baleares'), ('CANARIAS', 'Canarias'), ('CANTABRIA', 'Cantabria'), ('CASTILLA Y LEON', 'Castilla y León'), ('CASTILLA-LA MANCHA', 'Castilla-La Mancha'), ('CATALUÑA', 'Cataluña'), ('EXTREMADURA', 'Extremadura'), ('GALICIA', 'Galicia'), ('MADRID', 'Madrid'), ('MURCIA', 'Murcia'), ('NAVARRA', 'Navarra'), ('PAIS VASCO', 'País Vasco'), ('LA RIOJA', 'La Rioja'), ('COMUNIDAD VALENCIANA', 'Comunidad Valenciana')], max_length=30)),
                ('rating_avg', models.FloatField(blank=True, null=True)),
                ('schedule', models.JSONField(blank=True, null=True)),
                ('birth_date', models.DateField()),
                ('collegiate_number', models.CharField(max_length=30)),
                ('services', models.JSONField(blank=True, null=True)),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')], max_length=1)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='physio', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PhysiotherapistSpecialization',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('physiotherapist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='physio_specializations', to='users.physiotherapist')),
                ('specialization', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='users.specialization')),
            ],
        ),
        migrations.AddField(
            model_name='physiotherapist',
            name='specializations',
            field=models.ManyToManyField(through='users.PhysiotherapistSpecialization', to='users.specialization'),
        ),
    ]
