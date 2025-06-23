from typing import Any, Dict, List
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView, Response
from .serializers import JournalSerializer, UserSerializer 
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import JournalEntries 
from django.http import HttpRequest 

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class JournalListCreate(generics.ListCreateAPIView):
    serializer_class = JournalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return JournalEntries.objects.filter(user=user).order_by('-id')

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

class JournalEntryUpdateDecs(APIView):
    serializer_class = JournalSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request: HttpRequest, id: int) -> Response:
        user = request.user
        # DO NOT use .update(), there might be a bug, only .save() works 
        journal_entry = JournalEntries.objects.get(user=user, id=id)
        journal_entry.decorations = request.data
        journal_entry.save()
        return Response({'message': f'Updated decs'})

    def get(self, request: HttpRequest, id: int) -> Response:
        user = request.user
        decorations = JournalEntries.objects.filter(user=user, id=id).values('decorations')
        return Response({'decorations': decorations[0]['decorations']})


# TODO: just make this the default way to get/post entry info
class JournalEntryUpdateFields(APIView):
    serializer_class = JournalSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request: HttpRequest, id: int) -> Response:
        user = request.user
        fields = request.GET.getlist('fields[]')
        # rows (we take only the first) of all requested fields
        result_row: Dict[str, Any] = JournalEntries.objects.filter(user=user, id=id).values(*fields)[0]
        return Response(result_row)

    def post(self, request: HttpRequest, id: int) -> Response:
        user = request.user
        journal_entry = JournalEntries.objects.get(user=user, id=id)
        for key, value in request.data.items():
            # we dont update user so skip - or don't give user id to the client
            if key == 'user':
                continue
            if hasattr(journal_entry, key):
                setattr(journal_entry, key, value)
            else:
                return Response({'error': f'Bad field: {key}'}, status=422)
        journal_entry.save()
        return Response({'msg': 'journal updated successfully', 'data': request.data})

    def put(self, request: HttpRequest, id: int) -> Response:
        return self.post(request, id)
