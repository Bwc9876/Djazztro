from django.shortcuts import render

from django.views.generic.list import ListView
from django.views.generic import CreateView, UpdateView, DeleteView

from .models import Todo


class HomeView(ListView):
    model = Todo
    template_name = "index"


class TodoCreateView(CreateView):
    model = Todo
    fields = ["title", "description"]
    template_name = "form"
    success_url = "/"


class TodoUpdateView(UpdateView):
    model = Todo
    fields = ["title", "description", "completed"]
    template_name = "form"
    success_url = "/"
