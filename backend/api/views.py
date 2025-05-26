from typing import Dict, List
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView, Response
from .serializers import JournalSerializer, UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import JournalEntries, Note
from django.http import HttpRequest 
from dataclasses import dataclass
from .ai.corrections import get_correction, get_decorations1

class NoteListCreate(generics.ListCreateAPIView):
    """
    This is a string doc
    """
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
        res = JournalEntries.objects.filter(user=user, id=id).values(*fields)
        return Response({'decorations': res})

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


@dataclass
class CorrectionResponse:
    changes_made: bool
    changes: List[Dict[int, str]]

class GetCorrections(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request: HttpRequest) -> Response:
        #is_asdf = re.compile(r'asdf')
        #changes = []
        #offset = request.data['start']+1

        #print(request.data)
        #for match in is_asdf.finditer(request.data['text']):
        #    start, end = match.span()
        #    start += offset
        #    end += offset
        #    changes.append([start, end, 'Dont be saying asdf'])
        #if changes:
        #    return Response({'changes_made': True, 'changes': changes})
        if not request.data['text']:
            return Response({'changes_made': False})

        corrected = get_correction(request.data['text'])
        decs = get_decorations1(request.data['text'], corrected, request.data['start'])
        print('data: ', request.data)
        #decs = [Decoration(1, 5, DecSpec('', DecAttrs('correction-dec')))]
        print(decs)

        if decs:
            return Response({'changes_made': True, 'changes': [d.to_dict() for d in decs]})
        return Response({'changes_made': False})

