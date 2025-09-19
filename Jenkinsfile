pipeline {
  agent any

  stages {
    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build') {
      steps {
        echo 'No build step needed for this app'
      }
    }

    stage('Run App') {
      steps {
        sh 'npm run start & sleep 5'
      }
    }
  }
}
