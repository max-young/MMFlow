 FROM python:3
 ENV PYTHONUNBUFFERED 1
 RUN mkdir /code
 WORKDIR /code
 ADD requirements.txt /code/
 RUN pip install -r requirements.txt
 ADD . /code/
 CMD ["python", "manage.py", "migrate"]
 CMD ["python", "manage.py", "loaddata", "groups, state_type, action_type"]
 CMD ["python", "manage.py", "runserver"]
