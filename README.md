# Xupply

[![CircleCI](https://circleci.com/gh/CASL-AE/supplyme-admin.svg?style=svg&circle-token=96cba64460e7ac5f2a898d06b3755b6fb9e599bc)](https://circleci.com/gh/CASL-AE/supplyme-admin)
[![Xupply site released under the MIT license.](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-blue.svg?style=flat-square)](#contributors-)


<p align="center">
  <img height="200px" width="auto" src="public/www/img/logo.png">
</p>

Xupply is a web application that connects those who NEED supplies with those who HAVE supplies and allows financiers to fund those who NEED supplies.

There are 3 users. “Retailers”, “Manufacturers” & “Financiers”.

**Retailers** create requests with items and the quantities.

**Financiers** fund the requests with a total budget. Requests can be funded at any time in the process to allow for speed.

**Manufacturers** create orders based on the requests. They also create the Items retailers can request to avoid duplicate items.

### Soon...

**Payments:** Requests are funded through the XRP blockchain. This allows us to create payment channels. Then as the order goes through the process, the financier can distribute the funds. Ex. After the order is created, the financier can release a portion of the funds, then later when the product is shipped, the financier can release the remaining funds. This can be done in any numbers of steps with any amount each time.

**Logistics:** We are connected with JB Hunt and Amazon working on 3rd party api integration to facilitate the shipment process into the application.

**Suppliers:** We do also want to add “suppliers” and allow the manufacturers to request supplies from them. Much like a retailer would a manufacturer.


# Project Status
Right now we’re in the very early stages of project development, but moving very rapidly! We’re currently assembling [teams](https://github.com/CASL-AE/supplyme-admin/blob/master/TEAM.md), speaking to organizations to assess needs, designing app workflows, and building the initial MVP.

# Tech Stack

* [React](https://www.react.com/) - 16.5 - The web framework used
* [Python](https://www.python.org/download/releases/3.5.1/) - 3.7.5 - Programing Language
* [Firebase](https://firebase.google.com/) - 4.6 - Realtime Database/Messaging/Auth/Analytics
* [Firestore](https://firebase.google.com/docs/firestore/) - 4.6 - Realtime Big Data Database
* [Nginx](https://nginx.org/en/) - HTTP and reverse proxy server
* [Gunicorn](https://github.com/benoitc/gunicorn) - Python WSGI HTTP Server for UNIX
* [Redis](https://redis.io/) - In-memory Data Structure Store
* [Celery](https://github.com/celery/celery) - Distributed Task Queue
* [Google Cloud](https://google.com) - Deployment of Application & Hosting

# Contributing

Please read [CONTRIBUTING](CONTRIBUTING.md) and [CODE_OF_CONDUCT](https://github.com/CASL-AE/supplyme-admin/blob/master/CODE_OF_CONDUCT.md) for details on our code of conduct, and the process for submitting pull requests to us.

Thank you to all the users who have contributed to this library!

<a href="https://github.com/CASL-AE/supplyme-admin/graphs/contributors">
  <img src="https://contributors-img.firebaseapp.com/image?repo=CASL-AE/supplyme-admin" />
</a>

# License

Xupply is available under the MIT license. See the [LICENSE](LICENSE) file for more info.
