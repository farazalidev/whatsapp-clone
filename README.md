# WhatsApp Web Clone(Nextjs, Nestjs)

This repository contains the source code for a real-time chat application built with Next.js and Nest.js. The application utilizes WebSockets for instant messaging, PostgreSQL as the database with TypeORM for ORM, Redis PubSub for websockets scalebity, Kafka to handle High throughput and also exposes a REST API 
for various functionalities.

# Screen shots
[![Screenshot-from-2024-03-28-18-05-14.png](https://i.postimg.cc/RZgMRFBr/Screenshot-from-2024-03-28-18-05-14.png)](https://postimg.cc/pmnbVPrk)

[![Screenshot-from-2024-03-28-18-05-21.png](https://i.postimg.cc/4xq0skv7/Screenshot-from-2024-03-28-18-05-21.png)](https://postimg.cc/bZ0g95Bp)

[![Screenshot-from-2024-03-28-18-05-32.png](https://i.postimg.cc/wMM513g6/Screenshot-from-2024-03-28-18-05-32.png)](https://postimg.cc/hQFQwDXw)

[![Screenshot-from-2024-03-28-18-06-17.png](https://i.postimg.cc/FFGpZ56t/Screenshot-from-2024-03-28-18-06-17.png)](https://postimg.cc/QV9c8PsS)

[![Screenshot-from-2024-03-28-18-06-34.png](https://i.postimg.cc/NFW540q7/Screenshot-from-2024-03-28-18-06-34.png)](https://postimg.cc/n9GFVpLC)

[![Screenshot-from-2024-03-28-18-06-58.png](https://i.postimg.cc/dVnTMw8v/Screenshot-from-2024-03-28-18-06-58.png)](https://postimg.cc/HrcLXGZP)
# Features
- Realtime messaging
- File sharing
- Voice messages
- Gallery Preview
- Profile Preview
- Contacts Management
- P2P Voice and Video call
- Authentication
- Realtime notifications

# How to setup locally

## PreRequsities
Kafka: [installation guide](https://kafka.apache.org/quickstart)\
Redis: [installation guide](https://redis.io/docs/install/install-stack/)\
PostgreSQL:[installation guide windws](https://www.w3schools.com/postgresql/postgresql_install.php) && [installation guide linux](https://www.devart.com/dbforge/postgresql/how-to-install-postgresql-on-linux)


# Before running
Open ```.env.example``` in all the projects and add the required environment variables

To setup locally you need to clone this Repo first:
```bash
git clone https://github.com/farazalidev/whatsapp-clone
```
After clonnging instant:
```bash
cd whatsapp-clone
```
install Dependencies
```bash
npm i
```

Because this repo is using Nx repo for managing Mono repos, setup Nx for your editor [Nx repo setup](https://nx.dev/features/integrate-with-editors)

open ```https://localhost:4200```
