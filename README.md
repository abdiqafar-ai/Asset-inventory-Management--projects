# Asset Inventory Management System

## Overview

The Asset Inventory Management System is a web application designed to help organizations track and manage their physical assets efficiently. It centralizes asset information, streamlines repair/new asset requests, and provides role-based access to ensure proper workflow and accountability.

## Features

### User Roles & Authentication

- **Roles**: Admin, Procurement Manager, Employee
- **JWT-based Authentication** with role-based access control
- Password hashing for security

### Asset Management

- Add/update/delete assets (Admin/Procurement)
- Asset allocation to employees
- Categorization with images

### Request Management

- Employees can request new assets/repairs
- Priority tagging (Low/Medium/High)
- Request status tracking (Pending/Approved/Rejected)
- Procurement managers review/approve requests

### Dashboard & Reporting

- Employees: View assigned assets & request history
- Managers: View pending/completed requests with filters
- Admin: Global view of all assets & analytics

## Technologies

**Frontend**:

- React.js + Redux Toolkit (State Management)
- Axios (API Calls)
- Jest + React Testing Library (Testing)

**Backend**:

- Python Flask (REST API)
- SQLAlchemy (ORM)
- PostgreSQL (Database)

**Other**:

- Figma (Wireframing)

## Frontend Setup

cd client

## Install dependencies

npm install

## Start development server

npm start

## Backend(.env)

DATABASE_URL=postgresql://user:password@localhost:5432/asset_db
JWT_SECRET_KEY=your_secret_key
UPLOAD_FOLDER=./uploads

## Api documentation

Key Endpoints:

Endpoint-Method--Description
/api/auth/login_POST---User authentication
/api/assets--GET_List all assets (Admin)
/api/requests_POST----Create new request

## Installation

### Prerequisites

- Node.js v16+
- Python 3.9+
- PostgreSQL 13+
- Redis (For session management)

### Backend Setup

## Clone repository

git clone https://github.com/your-org/asset-management.git
cd backend

## Create virtual environment

python3 -m venv venv
source venv/bin/activate

## Install dependencies

pip install -r requirements.txt

## Configure environment

cp .env.example .env

## Run migrations

flask db upgrade

## Start server

flask run --port=5000

## License

MIT License - See LICENSE
