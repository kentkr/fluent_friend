from typing import List
from django.db import models
from django.contrib.auth.models import User


class JournalEntries(models.Model):
    # by default PK id will be created
    user = models.ForeignKey(User, on_delete=models.CASCADE) # id gets appended here
    title = models.CharField(max_length=255, null = True)
    text = models.TextField(null = True)
    decorations = models.JSONField(null=True, default=list)
    ignore_decorations = models.JSONField(null=True, default=list)
    language = models.TextField(null = False, default='auto')
    native_language = models.TextField(null = True)

    class Meta:
        db_table = 'journal_entries'  # Custom table name

    @classmethod
    def get_field_names(cls) -> List[str]:
        return [field.name for field in cls._meta.fields]
