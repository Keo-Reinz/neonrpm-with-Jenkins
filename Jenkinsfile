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
        echo "Building Docker image (artifact)"
        bat """
        docker logout
        docker build -t neonrpm-app .
        """
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
        echo "Deploying Docker container"
        bat """
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
            
          REM Tag with 'latest'
          docker tag neonrpm-app %DOCKER_USER%/neonrpm-app:latest
          docker push %DOCKER_USER%/neonrpm-app:latest
            
          REM Tag with Jenkins build number
          docker tag neonrpm-app %DOCKER_USER%/neonrpm-app:%BUILD_NUMBER%
          docker push %DOCKER_USER%/neonrpm-app:%BUILD_NUMBER%
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
