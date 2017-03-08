#!/usr/bin/env bash

cd /opt

mkdir /opt/mongodb

mkdir /var/mongodb
mkdir /var/mongodb/data/db
mkdir /var/mongodb/logs

wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel62-3.4.2.tgz

tar xvf mongodb-linux-x86_64-rhel62-3.4.2.tgz

rm -f mongodb-linux-x86_64-rhel62-3.4.2.tgz



