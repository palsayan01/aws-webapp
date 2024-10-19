sudo apt-get update -y
sudo apt-get install -y unzip
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - 
sudo apt install -y nodejs
sudo apt-get install -y postgresql postgresql-contrib

sudo node -v
sudo npm -v
sudo psql --version

sudo systemctl enable postgresql
sudo systemctl start postgresql

sudo -u postgres psql -c "CREATE USER $USER WITH PASSWORD '$PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE $DATABASE;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DATABASE TO $USER;"
sudo -u postgres psql -c "ALTER DATABASE $DATABASE OWNER TO $USER;"