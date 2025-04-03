
<img width="1512" alt="Screenshot 1446-09-11 at 3 19 32 pm" src="https://github.com/user-attachments/assets/88dfdbea-8646-4390-ab5c-23a447e77be6" />
   
<img width="1512" alt="Technician Dashboard" src="https://github.com/user-attachments/assets/2741c257-b43b-4240-926a-efe73f970ca9" />


<img width="480" alt="Screenshot 1446-09-11 at 1 51 14 pm" src="https://github.com/user-attachments/assets/1fcfc6a8-17ea-45a6-8e84-fd815e52d2bb" />

Gold Mine Management System
An advanced mining management application designed for seamless machine operations tracking, performance monitoring, and maintenance reporting.

📖 Table of Contents
Introduction
Features
Tech Stack
Installation & Setup
Deployment
Usage Guide
Database Schema
Testing
Security Measures
Contributors
License
 Introduction
The Gold Mine Management System is an intelligent web-based solution designed to streamline mining machine operations, track performance, and enhance maintenance workflows. It provides dedicated dashboards for Admins, Technicians, and Operators, ensuring real-time monitoring and efficient machine management.

Why this project?

Eliminates manual tracking of machine status.
Provides automated maintenance scheduling.
Enhances data-driven decision-making via performance reports.
  Features
  Admin Dashboard

User management (Technicians, Operators).
Machine CRUD operations.
Performance analytics and downtime tracking.
  Technician Dashboard

View and manage assigned machines.
Update machine status (Available, In Use, Maintenance).
Report issues.
 Operator Dashboard

Start & Stop machine operations.
Track real-time machine availability.
Submit issue reports.
 General Features

Role-based authentication (JWT).
Secure API endpoints with Django REST framework.
Advanced search & filtering for machine logs.
Performance analytics visualization.
Cross-browser & mobile-responsive UI.

### Tech Stack

<img width="663" alt="Screenshot 1446-09-11 at 1 45 07 pm" src="https://github.com/user-attachments/assets/903afa78-f2d3-4edb-b330-7c421d58e322" />


##Installation & Setup
 Prerequisites
Python 3.12+
Node.js & npm (for frontend)
PostgreSQL Database
 Backend Setup

<img width="631" alt="Screenshot 1446-09-11 at 1 47 59 pm" src="https://github.com/user-attachments/assets/1dfa5a5a-9f94-49d6-9be1-fdc30ab9abee" />



# Clone the repository
git clone https://github.com/Kaiyfa/gold-mine-repo.git
cd gold-mine-repo/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Run the development server
python manage.py runserver
Frontend Setup

<img width="646" alt="Screenshot 1446-09-11 at 1 49 06 pm" src="https://github.com/user-attachments/assets/f6b023cd-68df-4045-8c99-1fa44074d6a7" />



# Install dependencies
npm install

# Start React app
npm start
Deployment
The app is deployed on Render.

 Deploy Backend
Ensure you have a Procfile:

bash
Copy
Edit
web: gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT
Ensure environment variables are set:

ini
Copy
Edit
DATABASE_URL=<your_render_postgres_url>
SECRET_KEY=<your_secret_key>
Deploy on Render:

Link your GitHub repository.
Set Python 3.12 runtime.
Click Manual Deploy.
Deploy Frontend
Use Netlify/Vercel for React hosting.
Connect your frontend folder to the hosting provider.
Usage Guide
Admin Credentials
Role	Username	Password
Admin	admin	adminpassword
Technician	tech1	techpassword
Operator	operator1	operatorpassword
API Endpoints
Method	Endpoint	Description
POST	/api/auth/login/	User authentication
GET	/api/machines/	Fetch all machines
PUT	/api/machines/update-status/<id>/	Update machine status
POST	/api/maintenance/report/	Submit maintenance report
📊 Database Schema
Use dbdiagram.io to visualize the schema.

plaintext
Copy
Edit
Table Machine {
  id int [primary key, auto_increment]
  name varchar(100)
  status varchar(30)
  manufacturer varchar(100)
  model_number varchar(100)
  purchase_date date
  last_maintenance_date datetime
  downtime_hours float
}

Table Users {
  id int [primary key, auto_increment]
  username varchar(100) [unique]
  password varchar(255)
  role enum('admin', 'technician', 'operator')
}

Table Maintenance {
  id int [primary key, auto_increment]
  machine_id int [ref: > Machine.id]
  issue_reported varchar(255)
  maintenance_start datetime
  maintenance_end datetime
}
Testing
Types of Tests Performed
Unit Testing: Tested individual components (pytest, unittest).
Integration Testing: Verified API responses (Postman).
Performance Testing: Benchmarked query execution time.
Security Testing: SQL Injection Prevention Passed .
Run Tests
bash
Copy
Edit
python manage.py test
 Security Measures
JWT-based authentication
CSRF & CORS protection
Role-based access control
Database encryption for sensitive data
Contributors
Name	GitHub
Adama Sall	Kaiyfa
Want to contribute? Fork the repo and submit a pull request!

License
This project is licensed under the MIT License.

Support & Contact
Project Owner: Kaiyfa
Issues/Bugs? Open an issue on GitHub.
Need help? Email me at adamal.sall@gmail.com








