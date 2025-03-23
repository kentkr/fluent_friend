import re
from typing import Dict, List
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView, Request, Response
from .serializers import JournalSerializer, UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import JournalEntries, Note
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpRequest


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class JournalListCreate(generics.ListCreateAPIView):
    serializer_class = JournalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return JournalEntries.objects.filter(user=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)


class JournalEntryDelete(generics.DestroyAPIView):
    serializer_class = JournalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return JournalEntries.objects.filter(user=user)


class JournalEntryUpdate(generics.UpdateAPIView):
    serializer_class = JournalSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        user = self.request.user
        return JournalEntries.objects.filter(user=user)

from dataclasses import dataclass

@dataclass
class CorrectionResponse:
    changes_made: bool
    changes: List[Dict[int, str]]


class GetCorrections(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request: HttpRequest) -> Response:
        is_asdf = re.compile(r'asdf')
        changes = []
        print(request.data)
        for match in is_asdf.finditer(request.data['text']):
            start, end = match.span()
            changes.append([start, end, 'Dont be saying asdf'])
        print(changes)
        if changes:
            return Response({'changes_made': True, 'changes': changes})
        return Response({'changes_made': False})

