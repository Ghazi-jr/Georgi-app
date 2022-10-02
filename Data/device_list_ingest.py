import psycopg2
import psycopg2.extras
import json


INSERT_STATEMENT = 'INSERT INTO device_list (type, properties ,geom) VALUES (%s, %s, ST_SetSRID(ST_GeomFromGeoJSON(%s), 4326));'


def create_table():
    conn = psycopg2.connect(
        "dbname='postgres' user='postgres' password='Pass2020!' host='localhost' port='5432'")
    cur = conn.cursor()
    cur.execute("DROP TABLE IF EXISTS device_list;")
    cur.execute(
        "CREATE TABLE IF NOT EXISTS device_list (type TEXT,properties hstore ,geom geometry(geometry, 4326));")
    conn.commit()
    conn.close()


create_table()


def import_feature(feature_data):
    conn = psycopg2.connect(
        "dbname='postgres' user='postgres' password='Pass2020!' host='localhost' port='5432' ")

    psycopg2.extras.register_hstore(conn)
    cur = conn.cursor()
    if feature_data.get('type') == 'FeatureCollection':
        for feature in feature_data['features']:
            import_feature(feature)
    elif feature_data.get('type') == 'Feature':
        geojson = json.dumps(feature_data['geometry'])

        str_dict = dict((str(k), str(v))
                        for k, v in feature_data['properties'].items())

        cur.execute(INSERT_STATEMENT, ('Feature', str_dict, geojson))
    conn.commit()
    conn.close()


with open('Device_List.geojson') as data_file:
    feature_data = json.load(data_file)

import_feature(feature_data)
