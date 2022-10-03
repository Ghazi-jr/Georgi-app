FROM python:3.8

COPY ./requirements.txt /Data/requirements.txt

WORKDIR /Data
RUN pip install -U pip
RUN pip install -r requirements.txt

COPY . /Data


CMD ["sh","-c","python device_list_ingest.py && python ingest_data_sensors.py"]
