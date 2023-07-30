from django.urls import path
from .views import ChatView, AboutView


app_name = "chat"

urlpatterns = [
        path("", ChatView.as_view(), name="chat_view"),
        path("about", AboutView.as_view(), name="about_view"),
        ]
