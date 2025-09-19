pipeline {
    agent any

    environment {
        DOCKER_USER = credentials('docker-username')
        DOCKER_PASS = credentials('docker-password')
        DISCORD_URL = credentials('discord-webhook')
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo "========================================"
                echo " INSTALL STAGE: Setting up Node.js deps  "
                echo " - Runs npm install for project packages "
                echo " - Ensures all dependencies are ready    "
                echo "========================================"
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                echo "========================================"
                echo " BUILD STAGE: Creating Docker image      "
                echo " - Logs out from Docker Hub (reset auth) "
                echo " - Pulls base image (node:18)            "
                echo " - Builds project image: neonrpm-app     "
                echo "========================================"
                bat """
                docker logout
                docker build -t neonrpm-app .
                """
            }
        }

        stage('Test') {
            steps {
                echo "========================================"
                echo " TEST STAGE: Running automated tests     "
                echo " - Executes Jest test suite              "
                echo " - Verifies core app functionality       "
                echo "========================================"
                bat 'npm test'
            }
        }

        stage('Code Quality') {
            steps {
                echo "========================================"
                echo " CODE QUALITY: Linting / Static Analysis "
                echo " - Runs ESLint / SonarQube checks        "
                echo " - Ensures code follows standards        "
                echo "========================================"
                echo "Running ESLint or SonarQube analysis (placeholder)"
            }
        }

        stage('Security Scan') {
            steps {
                echo "========================================"
                echo " SECURITY SCAN: Auditing dependencies    "
                echo " - Runs npm audit                        "
                echo " - Formats report to security-report.md  "
                echo "========================================"
                bat 'npm audit --json > audit-report.json || exit 0'
                bat 'node scripts/format-audit.js'
            }
        }

        stage('Deploy') {
            steps {
                echo "========================================"
                echo " DEPLOY STAGE: Running app in Docker     "
                echo " - Stops/removes old neonrpm-app         "
                echo " - Runs new container on port 3000       "
                echo "========================================"
                bat """
                docker ps -q -f name=neonrpm-app > nul && docker stop neonrpm-app || echo "No container to stop"
                docker ps -a -q -f name=neonrpm-app > nul && docker rm neonrpm-app || echo "No container to remove"
                docker run -d -p 3000:3000 --name neonrpm-app neonrpm-app
                """
            }
        }

        stage('Release') {
            steps {
                echo "========================================"
                echo " RELEASE STAGE: Publishing to Docker Hub "
                echo " - Logs into Docker Hub with credentials "
                echo " - Tags neonrpm-app as keoreinz repo     "
                echo " - Pushes image to Docker Hub            "
                echo "========================================"
                withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
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
                echo "========================================"
                echo " MONITORING STAGE: Health check & Alerts "
                echo " - Checks /health endpoint               "
                echo " - Posts status to Discord webhook       "
                echo "========================================"
                bat """
                REM Health check
                curl http://localhost:3000/health || exit 1
                """

                withCredentials([string(credentialsId: 'discord-webhook', variable: 'DISCORD_URL')]) {
                    bat """
                    curl -k -H "Content-Type: application/json" ^
                        -X POST ^
                        -d "{\\"content\\": \\"NeonRPM Monitoring PASSED — app is healthy at ${BUILD_URL}\\"}" ^
                        %DISCORD_URL%
                    """
                }
            }
        }
    }
}
