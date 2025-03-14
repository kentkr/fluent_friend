from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("journal_entries/", views.JournalListCreate.as_view(), name="journal-entries"),
    path("journal_entries/delete/<int:pk>/", views.JournalEntryDelete.as_view(), name="delete-journal-entry"),
    path("journal_entries/update/<int:id>/", views.JournalEntryUpdate.as_view(), name="update-journal-entry"),
]
