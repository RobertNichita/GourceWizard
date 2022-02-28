# CSCC09: Team `sans nom` Project Proposal

### Project Title: 

Gource Wizard

### Team Members:

- Darren Liu, 1005024046, [dar.liu@mail.utoronto.ca](mailto:dar.liu@mail.utoronto.ca)
- Ryan Sue, 1005253431, [ryan.sue@mail.utoronto.ca](mailto:ryan.sue@mail.utoronto.ca)
- Robert Nichita, 1005036890, [robert.nichita@mail.utoronto.ca](mailto:robert.nichita@mail.utoronto.ca)

### Description of the web application: 

Create a web application which generates customizable timelapse video visualizations of a GitHub repository using open source tools (Gource https://github.com/acaudwell/Gource, FFmpeg), given the GitHub repository link. This web application will rely on various third party APIs to authenticate the user, queue jobs, generate videos and host videos.

### Description of the key features that will be completed by the Beta version:

- Authentication using GitHub
  - Since this application visualizes GitHub repos, users will log in using their GitHub account and the visualizations of inputted GitHub repos will be linked to their accounts.

- Video Generation
  - GitHub repo visualizations will be generated using Gource.
- Video Serving
  - Visualizations will be saved somewhere in a file/video hosting service and made accessible to the user.
- Basic UI
  - The user interface will be minimal, supporting only the features proposed in this list
- Constraints
  - No customization of video properties
    - Gource has many visual configuration options (see https://github.com/acaudwell/Gource/wiki/Controls) which can change the video produced. These properties will not be customizable in the beta version.
  - No private videos
    - All generated visualization videos will be public in the beta version.
  - No visualization of private github repos

### Description of the additional features that will be complete by the Final version:

- "Library Page" with descriptions and public/private video link
  - This page will list all the visualization videos created by the user, along with descriptions next to the video. Also, the user can make videos publicly visible or not
- Gource Customizations
  - The user can toggle some ffmpeg and gource customizations to change the visualization video.
    - See https://github.com/acaudwell/Gource/wiki/Controls for some options
- Private Repos
  - Private Git repositories will be supported and the user interface will display a list of the user’s private repos by using the GitHub API.

### Description of the technology stack that you will use to build and deploy it:

#### Frontend

- React
- Typescript
- scss
- Tailwind CSS

#### Backend

- Nodejs/Express
- GraphQL
- Non-Standard Libraries:
  - Gource
  - FFMPEG
- PassportJS
- MongoDB/Mongoose
- Message Queue, possibly AWS SQS

#### Deployment / Infrastructure

- Docker
- Linux (Ubuntu)
- AWS EC2 and SQS (simple queue system)
- MongoDB Atlas Database (Cloud hosted MongoDB)

#### Description of the top 5 technical challenges:

- Storing large video files and serving them efficiently
- Security
  - Git clone for random repos
  - Securing Shell command arguments passed in from UI to shell (gource)
- Producing video files in parallel
- Github integrations
  - Authentication and using the GitHub API for account information
- Webhooks to alert Gource Wizard to re-create the video visualization upon every new commit