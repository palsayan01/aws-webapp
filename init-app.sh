sudo groupadd csye6225
sudo useradd csye6225 --shell /usr/sbin/nologin -g csye6225
sudo cp /tmp/csye6225-aws.service /etc/systemd/system/
sudo cp /tmp/webapp.zip /opt/
sudo unzip /opt/webapp.zip -d /opt/webapp
cd /opt/webapp
env_values=$(cat <<END
HOST=$HOST
PORT=$PORT
DATABASE=$DATABASE
USER=$USER
DIALECT=$DIALECT
PASSWORD=$PASSWORD
BCRYPT_SALT_ROUNDS=$BCRYPT_SALT_ROUNDS
END
)

echo "$env_values" | sudo tee .env >/dev/null
sudo chown -R csye6225:csye6225 /opt/webapp
sudo chown csye6225:csye6225 .env
sudo npm install
sudo systemctl daemon-reload
sudo systemctl enable csye6225-aws
