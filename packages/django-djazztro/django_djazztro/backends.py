import os
import requests

from django.template.backends.utils import csrf_input_lazy, csrf_token_lazy
from django.template import TemplateDoesNotExist, TemplateSyntaxError
from django.template.backends.django import DjangoTemplates
from django.template.engine import Engine
from django.conf import settings


class TemplateFetchError(Exception):
    pass


class DjazztroBackend(DjangoTemplates):
    def get_template(self, template_name):
        if settings.DEBUG:
            return self.get_template_dev(template_name, settings.ASTRO_PORT or 3000)
        else:
            return self.get_template_prod(template_name)

    def get_template_prod(self, template_name):
        return super().get_template(f"{template_name}.html")

    def get_template_dev(self, template_name, dev_port):
        try:
            resp = requests.get(f"http://localhost:{dev_port}/{template_name}.html")
            if resp.status_code == 404:
                return self.get_template_prod(template_name)
            template_text = resp.text.replace(
                'src="/', f'src="http://localhost:{dev_port}/'
            )
            return self.from_string(template_text)
        except requests.ConnectionError:
            raise TemplateFetchError(
                f"Can't connect to Astro, is it running? (Tried: http://localhost:{dev_port})"
            )


class Template:
    def __init__(self, template):
        self.template = template

    def render(self, context=None, request=None):
        if context is None:
            context = {}
        if request is not None:
            context["request"] = request
            context["csrf_input"] = csrf_input_lazy(request)
            context["csrf_token"] = csrf_token_lazy(request)
        return self.template.render(context)
