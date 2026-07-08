from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
            CREATE TABLE IF NOT EXISTS api_contactmessage (
                id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
                name varchar(120) NOT NULL,
                email varchar(254) NOT NULL,
                message text NOT NULL,
                email_sent bool NOT NULL,
                email_error text NOT NULL,
                created_at datetime NOT NULL
            );
            """,
            reverse_sql="DROP TABLE IF EXISTS api_contactmessage;",
        ),
    ]
