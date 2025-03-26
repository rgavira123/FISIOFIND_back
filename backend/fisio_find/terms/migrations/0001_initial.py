# Generated by Django 5.1.6 on 2025-03-26 17:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Terms',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField(help_text='Markdown content for the terms')),
                ('version', models.CharField(max_length=100)),
                ('tag', models.CharField(choices=[('terms', 'Terms of Use'), ('cookies', 'Cookie Policy'), ('privacy', 'Privacy Policy'), ('license', 'License')], default='terms', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('modifier', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='users.admin')),
            ],
            options={
                'verbose_name': 'Term',
                'verbose_name_plural': 'Terms',
            },
        ),
    ]
