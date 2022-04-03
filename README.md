# Project sans-nom: Gource Wizard

## Project URL

https://gource-wizard.ryan.software

## Project Video URL 

**Task:** Provide the link to your youtube video. Please make sure the link works. 

## Project Description

**Task:** Provide a detailed description of your app

## Development

**Task:** Leaving deployment aside, explain how the app is built. Please describe the overall code design and be specific about the programming languages, framework, libraries and third-party api that you have used. 

### Overall Architecture

Draw a quick system diagram with all the players then talk about them at a low level.

- Talk about how we're using typescript and gsx.

### Front End

Talk about front end. React, tailwind and stuff.

### Back End

Talk about back end. GraphQL and stuff.

#### Authentication with GitHub

Talk about GitHub.

#### Database

Talk about why we're using Mongo.

#### Message Queue

Talk about why we're using Rabbit

### Worker

Talk about how the worker works.

### Content Delivery Network

Talk about content delivery network.

## Deployment

**Task:** Explain how you have deployed your application. 

Deployed on AWS to an t2.medium
- Database
- Rabbit
- Frontend
- Backend
- Prom/Grafana
- Sentry

Deployed on our school VMs
- 1 worker per group member = 3 workers total.

Security Group/Firewall
- Only incoming SSH from a non-standard port, HTTP on 80 for nginx. Frontend/Backend are not directly accessible, must go through nginx.
- Database not accessible unless you connect through SSH.
- TCP on a non-standard rabbit port.
- Rabbit requires authenticated, it is publicly accessible because we want to use our school nodes as


## Maintenance

**Task:** Explain how you monitor your deployed app to make sure that everything is working as expected.

- Grafana
- Sentry
- UptimeRobot for basic uptime of the service.

## Challenges

**Task:** What is the top 3 most challenging things that you have learned/developed for you app? Please restrict your answer to only three items. 

1.
2.
3. CDN stuff.

## Contributions

**Task:** Describe the contribution of each team member to the project. Please provide the full name of each team member (but no student number). 

# One more thing? 

**Task:** Any additional comment you want to share with the course staff? 