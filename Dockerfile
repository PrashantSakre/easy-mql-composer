FROM python:3.6.15-alpine3.14

WORKDIR /opt/easymql-composer/

EXPOSE 5000

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY run.py .

COPY app app

CMD ["python", "run.py"]
