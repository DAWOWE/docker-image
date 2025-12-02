pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = 'dockerhub-creds'   // Jenkins credentials ID for Docker Hub
    SSH_CREDENTIALS       = 'app-ssh-server-key'       // Jenkins SSH credential ID for app-server
    DOCKER_IMAGE          = 'DAWOWE/docker-image' // change this
    APP_HOST              = 'ec2-user@54.147.95.3'      // change to app server
    APP_PORT              = '3000'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Image') {
      steps {
        script {
          IMAGE_TAG = "${env.BUILD_NUMBER}"
          IMAGE_FULL = "${DOCKER_IMAGE}:${IMAGE_TAG}"
          sh "docker build -t ${IMAGE_FULL} ."
        }
      }
    }

    stage('Login & Push') {
      steps {
        script {
          docker.withRegistry('', "${DOCKERHUB_CREDENTIALS}") {
            sh "docker push ${IMAGE_FULL}"
            sh "docker tag ${IMAGE_FULL} ${DOCKER_IMAGE}:latest"
            sh "docker push ${DOCKER_IMAGE}:latest"
          }
        }
      }
    }

    stage('Deploy to EC2') {
      steps {
        script {
          // Use SSH agent plugin
          sshagent([ "${SSH_CREDENTIALS}" ]) {
            sh """
              ssh -o StrictHostKeyChecking=no ${APP_HOST} '
                docker pull ${IMAGE_FULL} || exit 1
                docker stop demo-app || true
                docker rm demo-app  || true
                docker run -d --name demo-app -p 80:${APP_PORT} -e BUILD_NUMBER=${IMAGE_TAG} ${IMAGE_FULL}
              '
            """
          }
        }
      }
    }
  }

  post {
    success {
      echo "Pipeline succeeded: ${IMAGE_FULL}"
    }
    failure {
      echo "Pipeline failed."
    }
  }
}
