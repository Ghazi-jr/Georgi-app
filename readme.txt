
#Docker-compose up

#For only the first time there is a problem install the hstore extension throught docker-compose So :
#Enter Postgres generated container CLI Then executes:
psql -h localhost -U postgres
create extension hstore;
#To check for it
\dx 
#Close Postgres CLI

#For only the first time too we need to ingest our data
#Cd to ./Data
#Execute device_list_ingest.py 
#Execute ingest_data_sensors.py

#Navigate to localhost:3000
#You are good to go :) 


