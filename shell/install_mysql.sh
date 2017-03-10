#!/usr/bin/env bash

function install_dep(){
    yum -y install wget
}

function install_mysql(){
    wget http://mysql.rpm
    yum -y install mysql.rpm
    rm -f mysql.rpm
}

function start_mysql(){
    install_dep
    install_mysql
    
    service mysqld start
}

start_mysql