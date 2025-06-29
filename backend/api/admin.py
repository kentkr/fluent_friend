from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# register custom user
admin.site.register(User, UserAdmin)
