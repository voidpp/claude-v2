from time import time

import pkg_resources
from starlette.applications import Starlette
from starlette.requests import Request
from starlette.templating import Jinja2Templates

from claude.components.types import Environment

from .components.folders import Folders

templates = Jinja2Templates(Folders.templates)


async def index(request: Request):
    app: Starlette = request.app
    version = str(time()) if app.debug else pkg_resources.get_distribution("claude").version

    return templates.TemplateResponse(
        name="index.html",
        context={
            "request": request,
            "version": version,
            "dev_mode": Environment.DEV_MODE.get(),
        },
    )
