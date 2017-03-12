#!/usr/bin/env bash

function add_user(){
    groupadd redis
    useradd redis -g redis
}

function install_dep(){
    yum -y install wget
}

function install_redis(){
   
    wget http://download.redis.io/releases/redis-3.2.8.tar.gz
    tar zxvf redis-3.2.8.tar.gz
    rm -f redis-3.2.8.tar.gz
    
    cd redis
    
    make & make install
    
    rm -rf redis-3.2.8
}

function start_redis(){
    add_user
    install_dep
    install_redis
    
    su redis
    redis-server &
}

start_redis