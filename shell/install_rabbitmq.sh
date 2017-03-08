#!/usr/bin/env bash

wget https://packages.erlang-solutions.com/erlang-solutions-1.0-1.noarch.rpm
rpm -Uvh erlang-solutions-1.0-1.noarch.rpm

rpm --import https://packages.erlang-solutions.com/rpm/erlang_solutions.asc

config="[erlang-solutions]
name=Centos $releasever - $basearch - Erlang Solutions
baseurl=https://packages.erlang-solutions.com/rpm/centos/$releasever/$basearch
gpgcheck=1
gpgkey=https://packages.erlang-solutions.com/rpm/erlang_solutions.asc
enabled=1"

echo >> /etc/yum.repos.d/

yum install erlang

wget https://github.com/rabbitmq/rabbitmq-server/releases/download/rabbitmq_v3_6_6/rabbitmq-server-3.6.6-1.el6.noarch.rpm

yum install rabbitmq-server-3.6.6-1.el6.noarch.rpm

/sbin/service rabbitmq-server start

rabbitmqctl status