#!/bin/bash

#Comienzo a contar el tiempo
START_TIME=$SECONDS

############################
########## Main ############
############################
sudo docker-compose up &

mongosh 'mongodb://admin:admin@127.0.0.1:27017' < create_coll_id.js
