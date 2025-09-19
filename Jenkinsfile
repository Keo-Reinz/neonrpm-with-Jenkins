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
        echo 'No build step needed for this app'
      }
    }

    stage('Run App') {
      steps {
        bat 'npm run start'
      }
    }
  }
}
