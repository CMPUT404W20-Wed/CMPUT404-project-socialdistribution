# Generated by Django 2.1.7 on 2020-03-24 05:00

from django.db import migrations, models
import django_mysql.models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_auto_20200324_0454'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='visibleTo',
            field=django_mysql.models.ListCharField(models.CharField(max_length=255), default=['asfsd'], max_length=255, size=None),
            preserve_default=False,
        ),
    ]