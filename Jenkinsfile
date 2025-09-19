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

    stage('Release') {
      steps {
        echo "Pushing Docker image to Docker Hub"
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            bat """
            docker login -u %DOCKER_USER% -p %DOCKER_PASS%
            docker tag neonrpm-app keoreinz/neonrpm-app:latest
            docker push keoreinz/neonrpm-app:latest
            """
          }
        }
      }




    stage('Monitoring') {
      steps {
        echo "Checking if app is healthy"
        bat """
        REM Run health check
        curl http://localhost:3000/health || exit 1
        """
      }
      post {
        success {
          withCredentials([string(credentialsId: 'discord-webhook', variable: 'DISCORD_URL')]) {
            bat """
            curl -k -H "Content-Type: application/json" ^
                 -X POST ^
                 -d "{\\"content\\": \\"NeonRPM Monitoring PASSED, app is healthy at ${env.BUILD_URL}\\"}" ^
                 %DISCORD_URL%
            """
          }
        }
        failure {
          withCredentials([string(credentialsId: 'discord-webhook', variable: 'DISCORD_URL')]) {
            bat """
            curl -k -H "Content-Type: application/json" ^
                 -X POST ^
                 -d "{\\"content\\": \\"NeonRPM Monitoring FAILED at ${env.BUILD_URL}, health check did not pass.\\"}" ^
                 %DISCORD_URL%
            """
          }
        }
      }
    }    
  }
}
