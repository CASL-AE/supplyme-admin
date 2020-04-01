#!/bin/sh
{
  pm2 delete xupply \
  && git pull \
  && cd /srv/www/supplyme-admin/static \
  && npm install \
  && npm run build:production \
  && pm2 start "/usr/local/bin/npm" --name "xupply" -- start
} || {
  git pull \
  && cd /srv/www/supplyme-admin/static \
  && npm install \
  && npm run build:production \
  && pm2 start "/usr/local/bin/npm" --name "xupply" -- start
}
