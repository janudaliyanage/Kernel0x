FROM debian:bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       openssh-server \
       steghide \
       bash \
    && rm -rf /var/lib/apt/lists/* \
    && useradd -m -s /bin/bash k0x_operator \
    && mkdir -p /run/sshd \
    && sed -i 's/^#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config \
    && sed -i 's/^PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config

COPY entrypoint.sh /entrypoint.sh
COPY dead-drop.jpg /home/k0x_operator/dead-drop.jpg

RUN chown k0x_operator:k0x_operator /home/k0x_operator/dead-drop.jpg \
    && chmod 750 /home/k0x_operator \
    && chmod 640 /home/k0x_operator/dead-drop.jpg \
    && chmod +x /entrypoint.sh

EXPOSE 22

ENTRYPOINT ["/entrypoint.sh"]
