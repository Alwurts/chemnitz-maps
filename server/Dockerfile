FROM python:3.12-slim AS base

WORKDIR /app

# **********
# deps stage
# **********
FROM base AS deps

RUN pip install pipenv

COPY Pipfile* ./

RUN pipenv install --dev --system --deploy

# ***********
# inter stage
# ***********
FROM deps AS inter

COPY . .

EXPOSE 8000

# **********
# prod stage
# **********
FROM inter AS prod

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]

# **********
# dev stage
# **********
FROM inter AS dev

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]