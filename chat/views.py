from django.views.generic import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404
from .models import JournalEntry


class ChatView(TemplateView):
    template_name: str = "chat/chat.html"

class AboutView(TemplateView):
    template_name: str = "chat/about.html"

@method_decorator(login_required, name='dispatch')
class JournalEntryView(TemplateView):
    template_name: str = "chat/journal_entry.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user_id = self.request.user.id
        entries = JournalEntry.objects.filter(user_id=user_id)
        context['entries'] = entries
        return context

    def post(self, request, *args, **kwargs):
        entry_id = request.POST.get('entry_id')
        if entry_id:
            entry = get_object_or_404(JournalEntry, id=entry_id, user_id=request.user.id)
            context = self.get_context_data()
            context['selected_entry'] = entry
            return render(request, self.template_name, context)

        return self.get(request, *args, **kwargs)
