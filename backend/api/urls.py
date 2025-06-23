from django.urls import path, re_path
from . import views
from .consumers import ChatConsumer

urlpatterns = [
    path("journal_entries/", views.JournalListCreate.as_view(), name="journal-entries"),
    path("journal_entries/delete/<int:pk>/", views.JournalEntryDelete.as_view(), name="delete-journal-entry"),
    path("journal_entries/update/<int:id>/", views.JournalEntryUpdateFields.as_view(), name="update-journal-entry-decs"),
]

websocket_urlpatterns = [
    re_path(r"ws/chat/$", ChatConsumer.as_asgi()),
]
