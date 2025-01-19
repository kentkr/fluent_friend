from django.db import models
from django.conf import settings

class JournalEntry(models.Model):
    # by default PK id will be created
    user = models.ForeignKey(settings.AUTH_USER_MODEL, models.CASCADE) # id gets appended here
    entry_name = models.CharField(max_length=255)
    text = models.TextField()

    class Meta:
        db_table = 'chat_journal_entry'  # Custom table name
