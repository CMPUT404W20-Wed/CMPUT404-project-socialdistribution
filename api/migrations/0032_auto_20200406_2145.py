# Generated by Django 2.2 on 2020-04-06 21:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0031_auto_20200405_2058'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.Post'),
        ),
    ]