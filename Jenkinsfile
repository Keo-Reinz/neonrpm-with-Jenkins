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
                echo " STAGE: INSTALL DEPENDENCIES            "
                echo " - Installing required npm packages     "
                echo "========================================"
                bat "npm install"
            }
        }

        stage('Build') {
            steps {
                echo "========================================"
                echo " STAGE: BUILD                           "
                echo " - Builds project files if build script "
                echo "   is available in package.json         "
                echo "========================================"
                bat "npm run build || echo Build step skipped (no build script found)"
            }
        }

        stage('Test') {
            steps {
                echo "========================================"
                echo " STAGE: TEST                            "
                echo " - Running automated Jest tests         "
                echo " - Ensures health and routes are valid  "
                echo "========================================"
                bat "npm test"
            }
        }

        stage('Code Quality') {
            steps {
                echo "========================================"
                echo " STAGE: CODE QUALITY                    "
                echo " - Run ESLint or SonarQube analysis     "
                echo " - Placeholder for static analysis      "
                echo "========================================"
                bat "echo Running ESLint or SonarQube (placeholder)"
            }
        }

        stage('Security Scan') {
            steps {
                echo "========================================"
                echo " STAGE: SECURITY SCAN                   "
                echo " - Running npm audit for vulnerabilities"
                echo " - Formats JSON to Markdown report      "
                echo "========================================"
                bat """
                npm audit --json > audit-report.json || exit 0
                node scripts/format-audit.js
                """
            }
        }

        stage('Deploy') {
            steps {
                echo "========================================"
                echo " STAGE: DEPLOY                          "
                echo " - Builds Docker image                  "
                echo " - Stops/removes old container          "
                echo " - Runs new container on port 3000      "
                echo "========================================"
                bat """
                REM Build Docker image
                docker build -t neonrpm-app .

                REM Stop old container if running
                docker ps -q -f name=neonrpm-app >nul && docker stop neonrpm-app

                REM Remove old container if exists
                docker ps -a -q -f name=neonrpm-app >nul && docker rm neonrpm-app

                REM Run new container on port 3000
                docker run -d -p 3000:3000 --name neonrpm-app neonrpm-app
                """
            }
        }

        stage('Release') {
            steps {
                echo "========================================"
                echo " STAGE: RELEASE                         "
                echo " - Logging into Docker Hub              "
                echo " - Tagging and pushing Docker image     "
                echo "========================================"
                bat """
                docker login -u %DOCKER_USER% -p %DOCKER_PASS%
                docker tag neonrpm-app keoreinz/neonrpm-app:latest
                docker push keoreinz/neonrpm-app:latest
                """
            }
        }

        stage('Monitoring') {
            steps {
                echo "========================================"
                echo " STAGE: MONITORING                      "
                echo " - Running health check endpoint        "
                echo " - Sending results to Discord webhook   "
                echo "========================================"
                bat """
                REM Run health check
                curl http://localhost:3000/health || exit 1
                """
            }
            post {
                success {
                    bat """
                    curl -k -H "Content-Type: application/json" ^
                        -X POST ^
                        -d "{\\"content\\": \\"NeonRPM Monitoring PASSED — app is healthy at http://localhost:8080/job/${JOB_NAME}/${BUILD_NUMBER}/\\"}" ^
                        %DISCORD_URL%
                    """
                }
                failure {
                    bat """
                    curl -k -H "Content-Type: application/json" ^
                        -X POST ^
                        -d "{\\"content\\": \\"NeonRPM Monitoring FAILED — health check did not pass at http://localhost:8080/job/${JOB_NAME}/${BUILD_NUMBER}/\\"}" ^
                        %DISCORD_URL%
                    """
                }
            }
        }
    }
}
