FROM python:3.6.15-alpine3.14

WORKDIR /opt/easymql-composer/

COPY . .

RUN pip install -r requirements.txt

CMD ["python", "run.py"]
