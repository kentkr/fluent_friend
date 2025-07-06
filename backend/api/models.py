from typing import List
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.auth.password_validation import validate_password

class CustomUserManager(BaseUserManager):
    def create_user(self, email: str, password: str | None = None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        validate_password(password)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email: str, password: str | None = None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    # email now unique, username not
    email = models.EmailField(unique=True)
    username = models.CharField(blank=True)

    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

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
