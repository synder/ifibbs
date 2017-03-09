#!/usr/bin/env bash



function add_user(){
    groupadd mongodb
    useradd mongodb -g mongodb 
}

function install_dep(){
    yum -y install  wget
}

function install_mongodb(){ 
    mkdir -p /var/mongodb/data/db
    mkdir -p /var/mongodb/logs
    chown -R mongodb:mongodb /var/mongodb/
   
    cd /opt
    wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel62-3.4.2.tgz
    tar xvf mongodb-linux-x86_64-rhel62-3.4.2.tgz
    rm mongodb-linux-x86_64-rhel62-3.4.2.tgz
    mv mongodb-linux-x86_64-rhel62-3.4.2 mongodb
}

function start_mongodb(){
    add_user
    install_dep
    install_mongodb
    
    su mongodb
    /opt/mongodb/bin/mongod --dbpath=/var/mongodb/data/db --logpath=/var/mongodb/logs --fork
}

start_mongodb