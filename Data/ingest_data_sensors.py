import psycopg2
import pandas as pd
import sqlalchemy
from sqlalchemy import create_engine
import json

from pandas.io.json import json_normalize
with open('data_sensors.json') as data_file:
    d = json.load(data_file)


def create_table():
    conn = psycopg2.connect(
        "dbname='postgres' user='postgres' password='Pass2020!' host='localhost' port='5432' ")
    cur = conn.cursor()
    cur.execute("DROP TABLE IF EXISTS data_sensors;")
    cur.execute(
        "CREATE TABLE IF NOT EXISTS data_sensors (id INTEGER, fid_measurement INTEGER, oid TEXT, timestamp_utc NUMERIC, value_payload TEXT, device_id INTEGER, protocol_version INTEGER, air_temperature_value FLOAT, air_temperature_unit TEXT, air_humidity_value FLOAT, air_humidity_unit TEXT, barometer_temperature_value FLOAT, barometer_temperature_unit TEXT, barometric_pressure_value INTEGER, barometric_pressure_unit TEXT, co2_concentration_value INTEGER, co2_concentration_unit TEXT, co2_concentration_lpf_value INTEGER, co2_concentration_lpf_unit TEXT, co2_sensor_temperature_value FLOAT, co2_sensor_temperature_unit TEXT,capacitor_voltage_1_value FLOAT,capacitor_voltage_1_unit TEXT, capacitor_voltage_2_value FLOAT, capacitor_voltage_2_unit TEXT, co2_sensor_status_value INTEGER,co2_sensor_status_unit TEXT, raw_ir_reading_value INTEGER,  raw_ir_reading_unit TEXT, raw_ir_reading_lpf_value INTEGER, raw_ir_reading_lpf_unit TEXT, battery_voltage_value FLOAT,battery_voltage_unit TEXT);")
    conn.commit()
    conn.close()


create_table()

df = json_normalize(d)
df.columns = df.columns.str.lower()
engine = create_engine(
    "postgresql+psycopg2://postgres:Pass2020!@localhost:5432/postgres")
df.to_sql("data_sensors", engine, index=False, if_exists='append')
print("Done")
