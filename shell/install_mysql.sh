#!/usr/bin/env bash

function install_dep(){
    yum -y install wget
}

function install_mysql(){
    
    
    mkdir -p /opt/mysql
    
    cd /opt
    
    cd ./mysql

    groupadd mysql
    useradd -g mysql mysql

    mkdir -p /var/mysql/data
    mkdir -p /var/mysql/logs
    
    chown -R mysql:mysql /var/mysql
    
    wget http://192.168.1.103:8080/mysql-5.7.17-1.el6.x86_64.rpm-bundle.tar
    
    tar xvf mysql-5.7.17-1.el6.x86_64.rpm-bundle.tar -c ./mysql
    rm -f mysql-5.7.17-1.el6.x86_64.rpm-bundle.tar
    yum -y install mysql.rpm
    
    cd mysql-5.7.17-1.el6.x86_64.rpm-bundle
    
    yum -y install ./mysql/mysql-community-common-5.7.17-1.el6.x86_64.rpm
    yum -y install ./mysql/mysql-community-libs-5.7.17-1.el6.x86_64.rpm
    yum -y install ./mysql/mysql-community-client-5.7.17-1.el6.x86_64.rpm
    yum -y install ./mysql/mysql-community-server-5.7.17-1.el6.x86_64.rpm
    
    rm -rf ../mysql-5.7.17-1.el6.x86_64.rpm-bundle
}

function config_mysql(){
    wget my.conf
    cp my.conf /etc/mysql/my.conf
    rm my.conf
}

function start_mysql(){
    
    
    service mysqld start
    service mysqld status
}
#install_dep
install_mysql
#config_mysql
#start_mysql