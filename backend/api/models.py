from typing import List
from django.db import models
from django.contrib.auth.models import User


class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title


class JournalEntries(models.Model):
    # by default PK id will be created
    user = models.ForeignKey(User, on_delete=models.CASCADE) # id gets appended here
    title = models.CharField(max_length=255, null = True)
    text = models.TextField(null = True)
    decorations = models.JSONField(null=True, default=list)

    class Meta:
        db_table = 'journal_entries'  # Custom table name

    @classmethod
    def get_field_names(cls) -> List[str]:
        return [field.name for field in cls._meta.fields]
