from django.urls import path
from .views import ChatView, AboutView, JournalEntryView, get_journal_entry, get_journal_titles


app_name = "chat"

urlpatterns = [
    path("", ChatView.as_view(), name="chat_view"),
    path("about", AboutView.as_view(), name="about_view"),
    path("about", AboutView.as_view(), name="about_view"),
    path("journal_entry", JournalEntryView.as_view(), name="journal_entry_view"),
    path("api/get_journal_entry/", get_journal_entry, name="get_journal_entry"),
    path("api/get_journal_titles/", get_journal_titles, name="get_journal_titles"),
]
