#!/usr/bin/env bash

function install_nginx(){
    yum -y install nginx
}

function start_nginx(){
    install_nginx
    
    nginx &
}

start_nginx