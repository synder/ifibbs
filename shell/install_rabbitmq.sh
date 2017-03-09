#!/usr/bin/env bash


function install_dep(){
    yum -y install wget
    yum -y install xmlto
}

function install_erlang(){
    wget http://www.xx.com/erlang.rpm
    yum -y install erlang.rpm
    rm -f erlang.rpm
}

function install_rabbitmq(){
    wget http://www.xx.com/rabbitmq-server-3.6.6-1.el6.noarch.rpm
    yum -y install rabbitmq-server-3.6.6-1.el6.noarch.rpm
    rm -f rabbitmq-server-3.6.6-1.el6.noarch.rpm
}

function start_rabbitmq(){

    install_dep
    install_erlang
    install_rabbitmq
    
    /sbin/service rabbitmq-server start
    rabbitmqctl status
}

start_rabbitmq