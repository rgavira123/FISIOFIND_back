# Generated by Django 5.1.6 on 2025-03-24 22:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Session',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=255, null=True)),
                ('day_of_week', models.CharField(choices=[('Monday', 'Lunes'), ('Tuesday', 'Martes'), ('Wednesday', 'Miércoles'), ('Thursday', 'Jueves'), ('Friday', 'Viernes'), ('Saturday', 'Sábado'), ('Sunday', 'Domingo')], max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='Exercise',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('area', models.CharField(choices=[('UPPER_BODY', 'Parte Superior del Cuerpo'), ('LOWER_BODY', 'Parte Inferior del Cuerpo'), ('CORE', 'Zona Media/Core'), ('FULL_BODY', 'Cuerpo Completo'), ('SHOULDER', 'Hombros'), ('ARM', 'Brazos (Bíceps, Tríceps)'), ('CHEST', 'Pecho'), ('BACK', 'Espalda'), ('QUADRICEPS', 'Cuádriceps'), ('HAMSTRINGS', 'Isquiotibiales'), ('GLUTES', 'Glúteos'), ('CALVES', 'Pantorrillas'), ('NECK', 'Cuello'), ('LOWER_BACK', 'Zona Lumbar'), ('HIP', 'Caderas'), ('BALANCE', 'Ejercicios de Equilibrio'), ('MOBILITY', 'Movilidad'), ('STRETCHING', 'Estiramientos'), ('PROPRIOCEPTION', 'Propiocepción')], max_length=255)),
                ('physiotherapist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exercises', to='users.physiotherapist')),
            ],
        ),
        migrations.CreateModel(
            name='ExerciseSession',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('exercise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exercise_sessions', to='treatments.exercise')),
                ('session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exercise_sessions', to='treatments.session')),
            ],
        ),
        migrations.CreateModel(
            name='Series',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('series_number', models.PositiveIntegerField()),
                ('repetitions', models.PositiveIntegerField()),
                ('weight', models.FloatField(blank=True, help_text='Carga en kg', null=True)),
                ('time', models.DurationField(blank=True, help_text='Tiempo en segundos', null=True)),
                ('distance', models.FloatField(blank=True, help_text='Distancia en metros', null=True)),
                ('exercise_session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='series', to='treatments.exercisesession')),
            ],
        ),
        migrations.CreateModel(
            name='ExerciseLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(auto_now_add=True)),
                ('repetitions_done', models.PositiveIntegerField(default=0)),
                ('weight_done', models.FloatField(blank=True, null=True)),
                ('time_done', models.DurationField(blank=True, null=True)),
                ('distance_done', models.FloatField(blank=True, null=True)),
                ('notes', models.TextField(blank=True, null=True)),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exercise_logs', to='users.patient')),
                ('series', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exercise_logs', to='treatments.series')),
            ],
        ),
        migrations.CreateModel(
            name='SessionTest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=255)),
                ('test_type', models.CharField(choices=[('text', 'Text'), ('scale', 'Scale')], default='text', max_length=10)),
                ('scale_labels', models.JSONField(blank=True, help_text='Etiquetas para cada valor para preguntas de tipo escala', null=True)),
                ('session', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='test', to='treatments.session')),
            ],
        ),
        migrations.CreateModel(
            name='SessionTestResponse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('response_text', models.TextField(blank=True, null=True)),
                ('response_scale', models.IntegerField(blank=True, null=True)),
                ('submitted_at', models.DateTimeField(auto_now_add=True)),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='test_responses', to='users.patient')),
                ('test', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='responses', to='treatments.sessiontest')),
            ],
        ),
        migrations.CreateModel(
            name='Treatment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField()),
                ('homework', models.TextField(blank=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='treatments', to='users.patient')),
                ('physiotherapist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='treatments', to='users.physiotherapist')),
            ],
        ),
        migrations.AddField(
            model_name='session',
            name='treatment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sessions', to='treatments.treatment'),
        ),
    ]
