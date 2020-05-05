# Xupply

## Getting Started

First you need to email the repository owner and ask for the `.env` file for the keys to the application.

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See production for notes on how to deploy the project on a live system.

**For Designers** Please note you do NOT need to setup the python backend server to run the frontend react application.

**Also** The functions below get the environment setup ASSUMING that your have updated python and node installed. You will also need to have nginx running over HTTPS to use the server functions.

If you didn't understand that, please skip "Launch Development API Python" and "Launch Development Node Server" and go right to "Install Development Environment on New Machine"

### Install Development Environment on New Machine

```
iOS X.X.X
Linux X.X.X
```

### Confirm/Install Node Env
Install Node/NPM (OSX)

```
brew install node
```

Install Node/NPM (Linux)

```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install build-essential
```

```
npm config get prefix
npm config set prefix '/usr/local'
sudo mkdir /usr/local/lib/node_modules
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
npm install -g npm
npm root -g
```

Install NPM Dependencies (OSX & Linux)

```
npm install -g node-gyp
npm install -g node-pre-gyp
```

### Confirm/Install Python
Install Python (OSX)

```
You should already have python, i need to revisit this...
```

Install Python (Linux)

```
sudo apt-get update
sudo apt-get install python3-pip python3-dev libpq-dev nginx
```

### Confirm/Install Virtual Env
Install OSX/Linux
```
pip3 install virtualenv virtualenvwrapper
rm -rf ~/.cache/pip
```
Version
```
sudo easy_install pip
pip --version
```
For Error
```
bash: /usr/local/bin/virtualenvwrapper.sh: No such file or directory
```
Fix With
```
find / -name virtualenvwrapper.sh
```
Add to Profile (OSX)
```
export APP_ENV="server.config.DevelopmentConfig"
export PATH=/usr/local/bin:$PATH
export WORKON_HOME=$HOME/.virtualenvs
source /usr/local/bin/virtualenvwrapper.sh
```

Add to Bash (OSX)
```
sudo nano ~/.bashrc
export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3.7
export WORKON_HOME=$HOME/.virtualenvs
source ~/.local/bin/virtualenvwrapper.sh
```

### Clone
```
git clone https://github.com/CASL-AE/supplyme-admin.git
&& mkvirtualenv supplymenet \
&& cd supplyme-admin \
&& pip3 install -U -r requirements.txt \
```

### Confirm Nginx
Install Nginx (OSX)
```
brew install nginx
```

Install Nginx (OSX)
```
sudo apt-get install nginx
```

Create SSL (OSX)
```
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /private/localhost.key -out /private/localhost.crt
sudo openssl dhparam -out /private/dhparam.pem 2048
```

Create SSL (Linux)
```
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/localhost.key -out /etc/ssl/localhost.crt
sudo openssl dhparam -out /etc/nginx/ssl/dhparam.pem 2048
```

Output
```
Output
Country Name (2 letter code) [AU]:US
State or Province Name (full name) [Some-State]:New York
Locality Name (eg, city) []:New York City
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Bouncy Castles, Inc.
Organizational Unit Name (eg, section) []:Ministry of Water Slides
Common Name (e.g. server FQDN or YOUR name) []:server_IP_address
Email Address []:admin@your_domain.com
```

Config Nginx (OSX)
```
sudo nano /usr/local/etc/nginx/nginx.conf
```

Config Nginx (Linux)
```
sudo nano /etc/nginx/sites-available/localhost
```

## For Public Html
```
server {
        listen 80;
        server_name localhost;
        root [path-to-repo]/supplyme-admin/public;
        index index.html index.htm;
        location / {
                try_files $uri $uri/ =404;
        }
        error_page 401 403 404 /404.html;
}
```

## For App
```

#gzip  on;

server {
    server_name app.localhost;

    ### SSL
    listen 443 ssl;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';
    ssl_prefer_server_ciphers on;
    ssl_dhparam /private/dhparam.pem;
    ssl_certificate /private/localhost.crt;
    ssl_certificate_key /private/localhost.key;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";

    root [path-to-repo]/supplyme-admin/static;
    index index.html index.htm;
    location / {
                    proxy_pass http://127.0.0.1:3001;
                    proxy_http_version 1.1;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection 'upgrade';
                    proxy_set_header Host $host;
                    proxy_cache_bypass $http_upgrade;
            }
    error_page 401 403 404 /404.html;
}
```

Enable (Linux)

```
sudo ln -s /etc/nginx/sites-available/localhost /etc/nginx/sites-enabled
```

Test
```
sudo nginx -t
```
Restart Nginx (OSX)
```
sudo nginx
```

Restart Nginx (Linux)
```
sudo systemctl restart nginx
```


### Contact Denis Angell for Env Keys

```
denis@caslnpo.org
```

### Launch Development API Python

```
cd supplyme-admin
workon supplymenet
python3 wsgi.py
```

### Launch Development Node Server

```
cd supplyme-admin/static
npm i
npm run dev
```
