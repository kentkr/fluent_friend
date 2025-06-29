from rest_framework import serializers
from .models import JournalEntries
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class JournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntries
        fields = JournalEntries.get_field_names()
        extra_kwargs = {"user": {"read_only": True}}
