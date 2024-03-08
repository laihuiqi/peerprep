# Credit original repository
**[Original repository and contibutions](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g16)**

# Getting Started

## Prerequisites

Install [Docker](https://www.docker.com/)

## Cloning the Repository

1. Open Terminal and navigate to the directory of your choice

```
cd path/to/directory
```

2. Clone the repository into that directory

```
git clone https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g16.git
```

## Build and Run on Local Docker Environment

Ensure that Docker and Docker Engine is up and running in your system.

1. Run the following command to build the containers.

```
docker-compose build
```

2. Run the following command to start the various services and frontend

```
docker-compose up
```

3. Now you can access the frontend of the application at `http://localhost:3001/`

4. For subsequent starts, you may skip the building step and run the `docker-compose up` command

5. To shut down the application, open a new Terminal and run the following command to graciously shut down these containers.

```
docker-compose down
```

# Service Status

## Overall Build

![Overall Build](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g16/actions/workflows/build_master_docker_services.yaml/badge.svg)

## Collaboration Service Build and Test

![Collaboration Service Build and Test](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g16/actions/workflows/build_and_test_master_collaboration_service.yaml/badge.svg)

## Matching Service Build and Test

![Matching Service Build and Test](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g16/actions/workflows/build_and_test_master_matching_service.yaml/badge.svg)

## Question Service Build and Test

![Question Service Build and Test](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g16/actions/workflows/build_and_test_master_question_service.yaml/badge.svg)

## User Service Build and Test

![User Service Build and Test](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g16/actions/workflows/build_and_test_master_user_service.yaml/badge.svg)

## Communication Service Build and Test

![Communication Service Build and Test](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g16/actions/workflows/build_and_test_master_communication_service.yaml/badge.svg)

## GPT Service Build and Test

![Communication Service Build and Test](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g16/actions/workflows/build_and_test_master_gpt_service.yaml/badge.svg)

## History Service Build and Test

![Communication Service Build and Test](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g16/actions/workflows/build_and_test_master_history_service.yaml/badge.svg)

## Frontend Client Build and Test

![Communication Service Build and Test](https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g16/actions/workflows/build_and_test_master_frontend_client.yaml/badge.svg)
