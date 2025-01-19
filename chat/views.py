from django.views.generic import TemplateView


class ChatView(TemplateView):
    template_name: str = "chat/chat.html"

class AboutView(TemplateView):
    template_name: str = "chat/about.html"

class JournalEntryView(TemplateView):
    template_name: str = "chat/journal_entry.html"
