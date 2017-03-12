#!/usr/bin/env bash

# 安装 java 8以上版本

function add_user(){
    groupadd elasticsearch
    useradd elasticsearch -g elasticsearch
}

function install_dep(){
    yum -y install wget
}

function install_java(){
    wget http://xx.java.rpm
    yum -y install  xx.java.rpm
    rm -f xx.java.rpm
}

function install_elasticsearch(){
    cd /opt
    mkdir -p /opt/elasticsearch
    wget http://xx.elasticsearch.rpm
    yum -y install xx.elasticsearch.rpm
    rm -f xx.elasticsearch.rpm
}

function start_elasticsearch(){
    add_user
    install_dep
    install_java
    install_elasticsearch

    su elasticsearch
    /opt/elasticsearch/bin/elasticsearch &
}


