#!/bin/bash

echo "k0x_operator:${SSH_PASSWORD:-Nexa@2026!}" | chpasswd

exec /usr/sbin/sshd -D
