from django.urls import path, re_path
from . import views
from .consumers import ChatConsumer

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("journal_entries/", views.JournalListCreate.as_view(), name="journal-entries"),
    path("journal_entries/delete/<int:pk>/", views.JournalEntryDelete.as_view(), name="delete-journal-entry"),
    path("journal_entries/update/<int:id>/", views.JournalEntryUpdateFields.as_view(), name="update-journal-entry-decs"),
    path("get_corrections/", views.GetCorrections.as_view(), name="get-corrections"),
]

websocket_urlpatterns = [
    re_path(r"ws/chat/$", ChatConsumer.as_asgi()),
]
