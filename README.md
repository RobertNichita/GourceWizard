# Project sans-nom: Gource Wizard

## Project URL

https://gource-wizard.ryan.software

## Project Video URL 

**Task:** Provide the link to your youtube video. Please make sure the link works. 

## Project Description - Darren

**Task:** Provide a detailed description of your app

The Gource Wizard application at it's core allows one to visualize their repositories as an animated tree with the directories as branches, and files as leaves, all without downloading any software. Simply log in using your Github Account and fill out the form and Gource Wizard servers will get to work on making your repo look the best it can. You can always come back later and look at your rendered videos again in the future, or create a link and share them with your friends.

There are various ways you can customize our video, such as:

- Changing the elasticity (alter the speed of physics for the file nodes in the tree)
- Render on every commit (this is accomplished using webhooks)
- Declare what section of the repository you want rendered


## Development

**Task:** Leaving deployment aside, explain how the app is built. Please describe the overall code design and be specific about the programming languages, framework, libraries and third-party api that you have used. 

### Overall Architecture - Ryan

![](docs/architecture.png)

Draw a quick system diagram with all the players then talk about them at a low level.

- Talk about how we're using typescript and gsx.

### Front End - Darren

For the Front End we decided on using the Javascript library React due to our teams preference for React's component-based structure and past experience working with the library (including past projects, courses and assignments for this course). Instead of using vanilla CSS, we decided to use the CSS Library Tailwind due to it's excellent synergy with React. Tailwind offers thousands of built-in classes that allows you to create great layouts by styling elements directly. This synergizes well with React as it allows us to style our reusable components faster and not have to worry about creating various utility classes. 

### Back End - Robert

Talk about back end. GraphQL and stuff.

#### Authentication/Webhook with GitHub - Robert

Talk about GitHub.

#### Database - Robert

Talk about why we're using Mongo.

#### Message Queue - Ryan

Talk about why we're using Rabbit

### Worker - Ryan

![](docs/worker.png)

Talk about how the worker works.

### Content Delivery Network - Ryan

Talk about content delivery network.

## Deployment - Ryan

**Task:** Explain how you have deployed your application. 

Production secrets are encrypted using [Mozilla SOPS](https://github.com/mozilla/sops).

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


## Maintenance - Ryan

**Task:** Explain how you monitor your deployed app to make sure that everything is working as expected.

- Grafana
- Sentry
- UptimeRobot for basic uptime of the service.

- https://uptimerobot.com/
- RabbitMQ
- Logs are saved, we can look at nginx logs and our application logs at any time.

## Challenges - Darren/Robert

**Task:** What is the top 3 most challenging things that you have learned/developed for you app? Please restrict your answer to only three items. 

1. Auth Stuff: Robert
2. Worker Stuff: Ryan, Video/CDN stuff.
3. One challenge we faced was using TailwindCSS. Although it has a great amount of utility classes, it sometimes was difficult to work with due to the no errors being raised when a certain class does not exist. For example, classes `w-1`, `w-1.5`, all the way to `w-12` are defined. `w-50` is not, and as a result using `w-50` would be like just not using a width class at all. Furthermore due to the teams inexperience with CSS, it was slow to get used to the utility classes of Tailwind since they often have less descriptive names are intended with people who are already comfortable with vanilla CSS. Often the pipeline would be looking at how to solve a problem in vanilla  CSS, and then looking up the corresponding utility class in Tailwind which is slow. Although once the team was comfortable with Tailwind, it proed to allow for faster development and more customizable styling. 

## Contributions - Darren

**Task:** Describe the contribution of each team member to the project. Please provide the full name of each team member (but no student number). 

**Robert Nichita**

Robert was primarily responsible for most of the backend tasks. This includes setting up the GraphQL schema, validation of inputs to the backend and to the worker, and authentication. Robert was tasked with allowing users to log in with their Github accounts, and setting up support for webhooks to allow the backend to perform tasks on each commit to the user's repository. Robert also setup Google TypeScript Style (GTS) for the project to allow for consistent linting and automatic code fixes. Robert also assisted Ryan with the deployment of the applications.

**Ryan Sue**

Ryan was primarily responsible for creating the worker machine (which renders and generates the videos using Gource) and serving the content from the worker to the backend swiftly. Furthermore he also did some development on the frontend such as creating the landing page for when a video render fails, and writing the services the frontend used to communicate with the server. Ryan was also the lead when deploying the application, having wrote the docker-compose files needed for deployment and a lot of the necessary setup.

**Darren Liu**

Darren's primary responsibility was designing and creating the UI. This includes creating the various UI components such as a custom class for buttons, validation of inputs in the frontend, and setting up routing for the frontend. Darren also set up protected routes, so any unauthenticated users could not view content they were not authenticated for and would be redirected to the login page. Furethermore he was also responsible for the TailwindCSS setup, which facilitated buiding complex responsive layouts much easier.

# One more thing? - Darren 

**Task:** Any additional comment you want to share with the course staff? 

If we had access to better servers (with better specs, GPUs, etc.) we could make the workers render videos faster and be able to process larger repositories. Oh also, we committed some secrets to GitHub during development, but we made sure to burn all of them ;) 