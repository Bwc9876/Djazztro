from django.contrib import admin
from django.urls import path
from django.shortcuts import render

from main import views

urlpatterns = [
    path("", views.HomeView.as_view(), name="home"),
    path("create/", views.TodoCreateView.as_view(), name="create"),
    path("update/<int:pk>/", views.TodoUpdateView.as_view(), name="update"),
    path("admin/", admin.site.urls),
]
