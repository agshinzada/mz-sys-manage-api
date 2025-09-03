# SYS Manage API

## Overview
The **SYS Manage API** is a Node.js and Express.js backend service that powers the **SYS Manage ERP** admin panel.  
It provides endpoints to manage multiple internal projects like **Client Manage** and **Archive Manage**, as well as company ERP operations including orders, cash registers, users, and reporting.  
The API communicates with an **MSSQL database** for storing and retrieving data and ensures seamless integration with the ERP system.

## Features
- RESTful API for managing internal projects (Client Manage, Archive Manage).  
- ERP order tracking and management.  
- User management and authentication.  
- Reporting and analytics endpoints.  
- Integration with frontend admin panel (SYS Manage ERP) (see [SYS Manage ERP](https://github.com/agshinzada/sys-manage-erp)).  

## Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MSSQL  
- **Language:** JavaScript  

## Installation
```bash
# Clone the repository
git clone https://github.com/agshinzada/mz-sys-manage-api.git

# Navigate into the project directory
cd mz-sys-manage-api

# Install dependencies
npm install

# Start the development server
npm run dev
