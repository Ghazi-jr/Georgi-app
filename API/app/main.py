from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from pydantic import BaseModel
from datetime import datetime


class Sensor(BaseModel):
    Device_ID: int


class Type(BaseModel):
    type: str


origins = [
    "http://localhost:3000",
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/data_sensors")
async def root():
    conn = psycopg2.connect(
        "dbname='postgres' user='postgres' password='Pass2020!' host='db' port='5432' ")
    cur = conn.cursor()
    cur.execute("SELECT * FROM data_sensors;")
    rows = cur.fetchall()
    conn.close()
    return {"message": rows}


@app.post("/comparative_graph")
async def get_comparative_data(tp: Type):
    types = {"Temperature": 'air_temperature_value',
             "Pressure": "barometric_pressure_value", "Humidity": "air_humidity_value", "CO2": "co2_concentration_value"}
    type_ = types[tp.type]
    conn = psycopg2.connect(
        "dbname='postgres' user='postgres' password='Pass2020!' host='db' port='5432' ")
    cur = conn.cursor()
    SELECT_STATEMENT = 'SELECT ' + type_ + \
        ', timestamp_utc FROM data_sensors WHERE device_id = %s ORDER BY timestamp_utc ASC;'
    # Could be fetched dynamically
    ids = [13010, 13012, 13014, 13016, 13018]
    data = {13010: [], 13012: [], 13014: [], 13018: [], 13016: [], "time": []}
    for id_ in ids:
        cur.execute(
            SELECT_STATEMENT, (str(id_),))
        dt = cur.fetchall()
        time = [datetime.fromtimestamp(
            float(tp[-1])).strftime("%m/%d/%Y, %H:%M:%S") for tp in dt]
        y = [round(tp[0], 2) for tp in dt]
        data[id_] = y

    data["time"] = time

    conn.close()
    return data


@app.post("/graph_data_by_sensor")
async def get_graph_data_by_sensor(sensor: Sensor):
    id_ = sensor.Device_ID
    print(id_)
    conn = psycopg2.connect(
        "dbname='postgres' user='postgres' password='Pass2020!' host='db' port='5432' ")
    cur = conn.cursor()
    cur.execute(
        "SELECT data_sensors.air_temperature_value, timestamp_utc FROM data_sensors WHERE device_id = %s ORDER BY timestamp_utc ASC;", (str(id_),))
    temp = cur.fetchall()
    time = [datetime.fromtimestamp(
        float(tp[-1])).strftime("%m/%d/%Y, %H:%M:%S") for tp in temp]
    tmp = [round(tp[0], 2) for tp in temp]
    cur.execute(
        "SELECT data_sensors.air_humidity_value, timestamp_utc FROM data_sensors WHERE device_id = %s ORDER BY timestamp_utc ASC;", (str(id_),))
    hum = cur.fetchall()
    hum = [round(tp[0], 2) for tp in hum]
    cur.execute(
        "SELECT data_sensors.barometric_pressure_value, timestamp_utc FROM data_sensors WHERE device_id = %s ORDER BY timestamp_utc ASC;", (str(id_),))
    press = cur.fetchall()
    press = [round(tp[0], 2) for tp in press]
    cur.execute(
        "SELECT data_sensors.co2_concentration_value, timestamp_utc FROM data_sensors WHERE device_id = %s ORDER BY timestamp_utc ASC;", (str(id_),))
    co2 = cur.fetchall()
    co2 = [round(tp[0], 2) for tp in co2]

    conn.close()
    return {"Time": time, "Temp": tmp, "Hum": hum, "Press": press, "CO2": co2}


@app.post("/data_per_sensor/")
async def get_data_per_sensor(sensor: Sensor):
    id_ = sensor.Device_ID
    conn = psycopg2.connect(
        "dbname='postgres' user='postgres' password='Pass2020!' host='db' port='5432' ")
    cur = conn.cursor()
    # Fetching Avg Data from each type
    cur.execute(
        "SELECT AVG(data_sensors.air_temperature_value) FROM data_sensors WHERE device_id = %s;", (str(id_),))
    temp_avg = cur.fetchone()[0]
    cur.execute(
        "SELECT AVG(data_sensors.air_humidity_value) FROM data_sensors WHERE device_id = %s;", (str(id_),))
    hum_avg = cur.fetchone()[0]
    cur.execute(
        "SELECT AVG(data_sensors.barometric_pressure_value) FROM data_sensors WHERE device_id = %s;", (str(id_),))
    press_avg = cur.fetchone()[0]
    cur.execute(
        "SELECT AVG(data_sensors.co2_concentration_value) FROM data_sensors WHERE device_id = %s;", (str(id_),))
    co2_avg = cur.fetchone()[0]
    # Fetching Last Data from each type
    cur.execute(
        "SELECT data_sensors.air_temperature_value FROM data_sensors WHERE device_id = %s ORDER BY timestamp_utc DESC;", (str(id_),))
    latest_temp = cur.fetchall()[0][0]
    cur.execute(
        "SELECT data_sensors.air_humidity_value FROM data_sensors WHERE device_id = %s ORDER BY timestamp_utc DESC;", (str(id_),))
    latest_hum = cur.fetchall()[0][0]
    cur.execute(
        "SELECT data_sensors.barometric_pressure_value FROM data_sensors WHERE device_id = %s ORDER BY timestamp_utc DESC;", (str(id_),))
    latest_press = cur.fetchall()[0][0]
    cur.execute(
        "SELECT data_sensors.co2_concentration_value FROM data_sensors WHERE device_id = %s ORDER BY timestamp_utc DESC;", (str(id_),))
    latest_co2 = cur.fetchall()[0][0]
    data = {
        "Temp_AVG": round(temp_avg, 2),
        "Latest_TEMP": round(latest_temp, 2),
        "Hum_AVG": round(hum_avg, 2),
        "Latest_Hum": round(latest_hum, 2),
        "Press_AVG": round(press_avg, 2),
        "Latest_Press": round(latest_press, 2),
        "CO2_AVG": round(co2_avg, 2),
        "Latest_CO2": round(latest_co2, 2)

    }
    conn.close()
    return data


@ app.get("/device_list")
async def root():
    conn = psycopg2.connect(
        "dbname='postgres' user='postgres' password='Pass2020!' host='db' port='5432' ")
    cur = conn.cursor()
    cur.execute(
        "SELECT type, ST_X(geom), ST_Y(geom), hstore_to_json(properties) FROM device_list")
    rows = cur.fetchall()
    # Get All Devices
    cur.execute(
        "SELECT hstore_to_json(properties) FROM device_list;")
    all_devices = cur.fetchall()
    all_devices = [int(dev[0]["Device_ID"]) for dev in all_devices]
    # Get active_devices Wich presents some data
    cur.execute(
        "SELECT device_id FROM data_sensors GROUP BY device_id;")
    active_devices = cur.fetchall()
    active_devices = [dev[0] for dev in active_devices]
    # Get Disabled devices
    disabled_devices = list(set(all_devices) - set(active_devices))

    conn.close()
    collection = []
    for row in rows:
        if int(row[3]["Device_ID"]) in disabled_devices:
            status = "Not Active"
        else:
            status = "Active"
        collection.append({
            "type": row[0],
            "properties": {
                "Device_ID": row[3]["Device_ID"],
                "Start": row[3]["Start"],
                "End": row[3]["End"],
                "Status": status},
            "geometry": {
                "type": "Point",
                "coordinates": [row[1], row[2]],
            },
        })
    return {"data": collection}
