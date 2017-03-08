#!/usr/bin/env bash

wget http://download.redis.io/releases/redis-3.2.8.tar.gz
tar zxvf redis-3.2.8.tar.gz

cd redis

make && make install

rm redis-3.2.8.tar.gz
rm -rf ./redis