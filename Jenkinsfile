pipeline {
  agent any

  stages {
    stage('Install Dependencies') {
      steps {
        bat 'npm install'
      }
    }

    stage('Build') {
      steps {
        echo 'Build stage placeholder - no build required for this app'
      }
    }

    stage('Test') {
      steps {
        echo 'Running tests'
        bat 'npm test'
      }
    }

    stage('Code Quality') {
      steps {
        echo 'Running ESLint or SonarQube analysis (placeholder)'
        // bat 'npx eslint .'
      }
    }

    stage('Security Scan') {
      steps {
        bat 'npm audit --json > audit-report.json || exit 0'
        bat 'node scripts/format-audit.js'
      }
    }


    stage('Deploy') {
      steps {
        echo "Building and running Docker container"
        bat """
        REM Build Docker image
        docker build -t neonrpm-app .

        REM Stop container if running
        docker ps -q -f name=neonrpm-app >nul && docker stop neonrpm-app

        REM Remove container if exists
        docker ps -a -q -f name=neonrpm-app >nul && docker rm neonrpm-app

        REM Run new container, expose port 3000
        docker run -d -p 3000:3000 --name neonrpm-app neonrpm-app
        """
      }
    }



    stage('Monitoring') {
      steps {
        echo "Checking if app is healthy"
        bat """
        REM Wait a few seconds to let the container start
        timeout /t 5 >nul

        REM Check the /health endpoint
        curl http://localhost:3000/health || exit 1
        """
      }
    }
  }
}
