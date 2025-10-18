# reportDashboard

##Overview 
   The Test Report Dashboard is a web application for managing, viewing, and downloading automated test reports. The project includes both a frontend UI and a backend API, and it is fully containerized using Docker.


##Tech Stack

  1.Frontend: React, JavaScript, HTML, CSS, Vite
  2.Backend: Node.js, Express.js
  3.Database: File system-based storage (used dummy data for sample testing)(/backend/data/testlogs)
  4.Containerization: Docker, Docker Compose
  
  
##Dashboard_project/

        ├── backend/
        │   ├── controllers/       # API logic
        │   ├── data/              # Test logs storage
        │   ├── routes/            # API routes
        │   ├── server.js          # Express server
        │   ├── package.json
        │   └── Dockerfile
        ├── frontend/
        │   ├── src/               # React components
        │   ├── public/            # Static assets
        │   ├── index.html
        │   └── Dockerfile
        ├── docker-compose.yml
        └── README.md



##Setup Instructions
  
   1. clone the project from 
      git clone https://github.com/developerumar1/reportDashboard.git
   2. change to the working directory --- cd reportDashboard
   3. docker-compose up --build
   4.Backend will be accessible at: http://localhost:5000
   5.Frontend will be accessible at: http://localhost:3000 


##API DOCUMENTATION

  List Items
    Endpoint: /api/listItems
    Method: GET
    Query Parameters:
    path (optional) - Relative path from testlogs root
    Sample Response:
          [
            {
                "isFolder": true,
                "name": "job_12345",
                "path": "job_12345",
                "size": 0
            }
          ]   


   Get File Content

        Endpoint: /api/file
        Method: GET
        Query Parameters:
        path - Relative file path
        Response: Raw text content of the file open in another browser

   Download File/Folder

        Endpoint: /api/download
        Method: GET
        Query Parameters:
        path - Relative file/folder path
        zip (optional) - If folder, returns a ZIP archive || If File, returns a file download
        Response: File or Folder download stream 

  ##Docker Images

    Frontend: test-report-dashboard-frontend 
    Backend: test-report-dashboard-backend

  ##Note: Images can be built locally using:
     docker build -t test-report-dashboard-frontend ./frontend
     docker build -t test-report-dashboard-backend ./backend