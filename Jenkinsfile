@Library('qa-common-library') _
properties(
  [
  buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '10', daysToKeepStr: '', numToKeepStr: '20')),
    parameters(
    [
    string( 
        name: 'executionCommand',
        description: 'Test command. UI: -c playwright.config.ts --project=chrome. API: -c playwright.api.config.ts',
        defaultValue: 'npx playwright test --grep @createOrganization -c "playwright.api.config.ts" --workers=1'
    ),
    choice(
        name: 'environment', 
        choices: ['stage', 'develop'], 
        description: 'Select Test Environment'
        
    ),

    string(
          defaultValue: 'BusinessSkills,DigitalSkills,ITDevSkills,MgmtLeadership,2020SSExpert,BusinessEssentials,LeadershipDevelopmentProgram,WintellectNow,GoFLUENT',
          description: 'Comma Separated License Pools. Modify list as required',
          name: 'licensePools'
    ),

    string(
      defaultValue: '',
      description: 'Slack Notification Channel',
      name: 'slackChannel'
    ),
    ]
      ),
      ])



def environmentVars
def summary
def suiteName = "site-shutdown-automation"
def replayLink = ""
def slackJunit = ""

def artifactsString = 'playwright-report/index.html'
def prefix = ""

// Used in script { } steps only — not inside top-level helper functions (Jenkins CPS binding).
def NODE_ALPINE_IMAGE = '510467250861.dkr.ecr.us-east-1.amazonaws.com/percipio-base:node-lts-alpine'

/** UI suite uses playwright.config.ts (auth setup + channel: chrome). API uses playwright.api.config.ts. */
def isUiPlaywrightRun(String executionCommand) {
  def cmd = executionCommand ?: ''
  if (cmd.contains('playwright.api.config.ts')) {
    return false
  }
  if (cmd.contains('playwright.config.ts')) {
    return true
  }
  // No -c flag → Playwright defaults to playwright.config.ts
  return !(cmd ==~ /.*-c\s+['"]?\S+.*/)
}

def dockerImageForPlaywright(String executionCommand) {
  if (isUiPlaywrightRun(executionCommand)) {
    return 'mcr.microsoft.com/playwright:v1.60.0-jammy'
  }
  return '510467250861.dkr.ecr.us-east-1.amazonaws.com/percipio-base:node-lts-alpine'
}



def getQASecrets(secretNames = [], secretRegion = 'us-east-1', destFolder = "/tmp/qa-secrets") {
  def assumeRoleArn = 'arn:aws:iam::401685041419:role/jenkins-master-qa-secret-role'
  echo "get QA -secret call"
  def roleSessionName = 'EC2FromDREAdmin'

  sh "mkdir -p " + destFolder
  // Assume the role allowed to talk to target account
  def stscall = '''
    set +x
    aws sts assume-role --role-arn ''' + assumeRoleArn + ''' --role-session-name ''' + roleSessionName + ''' --query \"Credentials.[AccessKeyId,SecretAccessKey,SessionToken]\" --output text 2>&1 > ''' + destFolder + '''/JenkinsMasterAccessKeys
    export QA_AWS_ACCESS_KEY_ID=$(cat ''' + destFolder + '''/JenkinsMasterAccessKeys | cut -d$'\t' -f1)
    export QA_AWS_SECRET_ACCESS_KEY=$(cat ''' + destFolder + '''/JenkinsMasterAccessKeys | cut -d$'\t' -f2)
    export QA_AWS_SESSION_TOKEN=$(cat ''' + destFolder + '''/JenkinsMasterAccessKeys | cut -d$'\t' -f3)
  '''
  for (secretName in secretNames) {
    stscall = stscall + '''
      mkdir -p ''' + destFolder + '/' + secretName + '''
      AWS_ACCESS_KEY_ID=\$QA_AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY=\$QA_AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN=\$QA_AWS_SESSION_TOKEN aws secretsmanager get-secret-value --secret-id "''' + secretName + '''" --region ''' + secretRegion + ''' --query 'SecretString'  --output text > ''' + destFolder + '/' + secretName  + '''/value
    '''
  }
  stscall = stscall + '''
    set -x
  '''

  def output = sh(returnStdout: true, script: stscall);
  echo "secretOutput: ${output}"
}


pipeline {
    agent {
        label 'innrd87'
      }
      // Triggers configured via top-level properties to allow branch-specific cron
      stages {
        
        stage('Build'){
            stages {
                stage("ECR Login") {
                    steps {
                        script {
                            echo "This is test message for puling DEVOPS library"
                            qajobautomation.loginToEcr() 
                            qajobautomation.setPslCredentials(params.environment)

                        }
                    }
                 }
                 stage('Install Dependencies') {
                    steps {
                        script {
                            testEnvironment = params.environment
                            currentBuild.description = testEnvironment + ": " + params.executionCommand
                        }
                        sh 'npm ci'
                    }
                 }

                 stage("Debug File Structure") {  
                    steps {  
                        script {  
                            sh "docker run -v \$(pwd):/app -w /app ${NODE_ALPINE_IMAGE} ls -al /app"  
                            sh "docker run -v \$(pwd):/app -w /app ${NODE_ALPINE_IMAGE} ls -al /app/helper/api"  
                        }  
                    }  
                }   

            }

        }
         
        stage("Execute Scripts") {   
            steps {    
                script {    
                    echo "This is test phase which mounts NODE Image and executes Test command"    
                    // Parameterize the location of the 'env' file based on the environment  
                    //def envFilePath = "psl/${params.environment}"  
                    def envFilePath = "psl/env"  
                    def additionalEnvVars = "export \$(cat ${envFilePath} | xargs)"  
                    // Existing environment variables  
                    //environmentVars = "${additionalEnvVars} && export DEBUG=true && export NODE_ENV=${params.environment}"  
                    environmentVars = "${additionalEnvVars}"  
                    environmentVars += " && export LICENSE_POOLS=\"${params.licensePools}\""
                    environmentVars += " && export CI=true"
                    def runImage = dockerImageForPlaywright(params.executionCommand)
                    def uiRun = isUiPlaywrightRun(params.executionCommand)
                    echo "NODE_ENV: ${params.environment}"    
                    echo "Docker image: ${runImage} (UI run: ${uiRun})"
                    echo "environmentVars: ${environmentVars}"    
                    echo "params.execution:  ${params.executionCommand}"   
            
                    // Define the command to run based on the environment    
                    def commandToRun = "npm install"    
                    commandToRun += " && export NODE_ENV=${params.environment}"  
                    commandToRun += " && npm run jenkins-config-template"
                    if (uiRun) {
                      commandToRun += " && npx playwright install chrome --with-deps"
                    }
                    commandToRun += " && ${params.executionCommand}" 
                    
                    // Log the command to be executed    
                    echo "Command to run: ${commandToRun}"    
            
                    // Execute the command within the Docker container  
                    // The environmentVars now includes the exported variables from the parameterized 'env' file  
                    sh "docker run --init -v \$(pwd):/app -w /app ${runImage} sh -c '${environmentVars} && ${commandToRun}'"    
                }    
            }    
        }

        stage('Publish Test Report') {
                steps {
                    // Archive the generated Playwright HTML report
                    archiveArtifacts artifacts: 'playwright-report/**/*', fingerprint: true
                }
         }

      }
    
    post {
        always {
            script {
                    try {
                        archiveArtifacts artifacts: artifactsString, fingerprint: true, allowEmptyArchive: true
                        publishHTML([allowMissing: true, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright Report', reportTitles: ''])

                        if (currentBuild.currentResult == 'SUCCESS') {
                            slackSend (color: '#74DF00', channel: params.slackChannel, message: "*${suiteName}* - Test Environment: *${params.environment.toUpperCase()}* \n*Tests*: ${params.executionCommand}\n*Success!* - <${env.BUILD_URL}|View Test Report> \nAutomation Branch: ${env.BRANCH_NAME}")
                        } else {
                            slackSend (color: '#FFFF00', channel: params.slackChannel, message: "*${suiteName}* - Test Environment: *${params.environment.toUpperCase()}* \n*Tests*: ${params.executionCommand}\n*Unstable!* - <${env.BUILD_URL}|View Test Failures> \nAutomation Branch: ${env.BRANCH_NAME}")
                        }
                    } catch (Exception e) {
                        echo "Failed to archive artifacts: ${e.message}"
                        slackSend (color: '#FF0000', channel: params.slackChannel, message: "*${suiteName}* - Test Environment: *${params.environment.toUpperCase()}* \n*Tests*: ${params.executionCommand}\n*Failed to generate report!* - <${env.BUILD_URL}|View Build> \nAutomation Branch: ${env.BRANCH_NAME}")
                    }
                }
            }
        }
}

