from django.http import HttpRequest, JsonResponse
from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods
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


@require_http_methods(['GET'])
@login_required
def get_journal_titles(request: HttpRequest) -> JsonResponse:
    user_id = request.user.id
    entries = JournalEntry.objects.filter(user_id = user_id).values('id', 'entry_name')
    response = JsonResponse({
        'tmp': list(entries),
    })
    return response
    #return JsonResponse({'error': 'entry id not provided'})

@require_http_methods(['GET'])
@login_required
def get_journal_entry(request: HttpRequest) -> JsonResponse:
    entry_id = request.GET.get('entry_id')
    if entry_id:
        entry = get_object_or_404(JournalEntry, id=entry_id, user_id=request.user.id)
        response = JsonResponse({
            'entry_name': entry.entry_name,
            'text': entry.text
        })
        return response
    return JsonResponse({'error': 'entry id not provided'})
