# 📱 WhatsApp Web Clone (Next.js & Nest.js)

Welcome to the **WhatsApp Web Clone** repository! This project is a real-time chat application built with the powerful combination of Next.js and Nest.js. It leverages WebSockets for instant messaging, PostgreSQL with TypeORM for database management, Redis PubSub for scalable WebSocket handling, and Kafka for managing high throughput. Additionally, it exposes a REST API for various functionalities.

## 📖 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Setup Locally](#-setup-locally)
  - [Prerequisites](#-prerequisites)
  - [Steps to Setup](#-steps-to-setup)

## 🌟 Features

- ✉️ Realtime messaging
- 📁 File sharing
- 🎙️ Voice messages
- 🖼️ Gallery Preview
- 👤 Profile Preview
- 📇 Contacts Management
- 📞 P2P Voice and Video calls
- 🔐 Authentication
- 🔔 Push notifications
- 🔔 In-app notifications
- 📜 Message status indicators

## 🖼️ Screenshots

[![Screenshot 1](https://i.postimg.cc/RZgMRFBr/Screenshot-from-2024-03-28-18-05-14.png)](https://postimg.cc/pmnbVPrk)
[![Screenshot 2](https://i.postimg.cc/4xq0skv7/Screenshot-from-2024-03-28-18-05-21.png)](https://postimg.cc/bZ0g95Bp)
[![Screenshot 3](https://i.postimg.cc/wMM513g6/Screenshot-from-2024-03-28-18-05-32.png)](https://postimg.cc/hQFQwDXw)
[![Screenshot 4](https://i.postimg.cc/FFGpZ56t/Screenshot-from-2024-03-28-18-06-17.png)](https://postimg.cc/QV9c8PsS)
[![Screenshot 5](https://i.postimg.cc/NFW540q7/Screenshot-from-2024-03-28-18-06-34.png)](https://postimg.cc/n9GFVpLC)
[![Screenshot 6](https://i.postimg.cc/dVnTMw8v/Screenshot-from-2024-03-28-18-06-58.png)](https://postimg.cc/HrcLXGZP)

## 🛠️ Setup Locally

### 📋 Prerequisites

1. **Kafka**: [Installation Guide](https://kafka.apache.org/quickstart)
2. **Redis**: [Installation Guide](https://redis.io/docs/install/install-stack/)
3. **PostgreSQL**: 
   - [Installation Guide for Windows](https://www.w3schools.com/postgresql/postgresql_install.php)
   - [Installation Guide for Linux](https://www.devart.com/dbforge/postgresql/how-to-install-postgresql-on-linux)
4. Open `.env.example` in all the projects and add the required environment variables.

### 🚀 Steps to Setup

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/farazalidev/whatsapp-clone
    ```
2. **Navigate to the Project Directory**:
    ```bash
    cd whatsapp-clone
    ```
3. **Install Dependencies**:
    ```bash
    npm install
    ```
4. **Setup Nx for Managing Monorepos**:
    - Follow the [Nx Repo Setup Guide](https://nx.dev/features/integrate-with-editors) for your editor.

5. **Run the Application**:
    - Open `https://localhost:4200` in your browser.

Enjoy building and expanding the functionalities of your very own WhatsApp Web Clone! 🚀
