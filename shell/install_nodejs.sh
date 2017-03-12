#!/usr/bin/env bash

function install_dep(){
    yum -y install curl
    yum -y install openssl
}

function install_node(){
    install_dep
    
    curl --silent --location https://rpm.nodesource.com/setup_7.x | bash -
    yum -y install nodejs
}

install_node
