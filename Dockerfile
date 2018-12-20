 FROM python:3
 ENV PYTHONUNBUFFERED 1
 RUN mkdir /code
 WORKDIR /code
 ADD requirements.txt /code/
 RUN pip install -r requirements.txt
 ADD . /code/
 EXPOSE 8000
 ENV NAME World
 CMD ["gunicorn", "MMFlowProject.wsgi", "--bind", "0.0.0.0:8000"]
