# Xupply

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See production for notes on how to deploy the project on a live system.

**For Designers** Please note you do NOT need to setup the python backend server to run the frontend react application.

## Clone Project Repo
```
git clone https://github.com/CASL-AE/supplyme-admin.git
```

### Launch Development API Python

```
cd supplyme-admin
workon xupplynet
pip3 install -U -r requirements.txt
python3 wsgi.py
```

### Launch Development Node Server

```
cd supplyme-admin/static
npm i
npm run dev
```

### Install Development Environment on New Machine

```
iOS X.X.X
```

### Confirm/Install Node Env
 Install
```
brew install node
```

Version
```
X.X.X
```

### Confirm/Install Virtual Env
Install
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
Add to Profile or Bash
```
sudo nano ~/.bash_profile
export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3.5
export WORKON_HOME=$HOME/.virtualenvs
source ~/.local/bin/virtualenvwrapper.sh
```
### Clone
```
git clone https://bitbucket.org/ae/supplyme-admin/src/master/
&& mkvirtualenv xupply \
&& cd supplyme-admin \
&& pip3 uninstall -r requirements.txt -y \
&& pip3 install -U -r requirements.txt \
```
### Confirm Nginx
Install Nginx
```
brew install nginx
```
Create SSL
```
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /private/localhost.key -out /private localhost.crt
sudo openssl dhparam -out /private/dhparam.pem 2048
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
Config Nginx
```
sudo nano /usr/local/etc/nginx/nginx.conf
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

Test
```
sudo nginx -t
```
Restart (After Computer Restart)
```
sudo nginx
```
