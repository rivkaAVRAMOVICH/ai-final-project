pipeline {
    agent any

    stages {
        stage('Install Backend') {
            steps {
                dir('server') {
                    sh 'npm install'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('server') {
                    sh 'npm test'
                }
            }
        }

        stage('Install Frontend') {
            steps {
                dir('client') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('client') {
                    sh 'npm run build'
                }
            }
        }
    }
}
