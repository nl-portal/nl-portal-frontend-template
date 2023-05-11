@Library('devopsJenkinsPlugins1') _
pipelineElsevierDeployment{
    jenkinsSlaveLabels = ['kubectl', 'java17-cliv2']
        jenkinsTools = [
            [
                tool: 'java',
                version: '17'
            ],
            [
                tool: 'NodeJS',
                version: '16'
            ]
        ]
    ecrRepositoryName = 'tep-portal-frontend'
}
