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
        echo 'Deploy stage placeholder - e.g., Docker or server deployment'
      }
    }

    stage('Monitoring') {
      steps {
        echo 'Monitoring stage placeholder - e.g., curl health check'
        // bat 'curl http://localhost:3000/index.html'
      }
    }
  }
}
