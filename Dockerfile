#-------------------------------------------------------------------------------------------
#-- This Dockerfile contains the required steps to build the containerized
#-- version of the "phasorz-has3w" application.
#-- Use the distributable "phasorz-linux-ubuntu-dist" version from this repo
#-- to build and deploy the Docker container to your Docker environment by running:
#-- 
#-- docker build -t $GH_IMAGE_NAME:$IMAGE_TAG .
#-- docker push $GH_IMAGE_NAME:$IMAGE_TAG
#-- 
#-- Where:
#--     $GH_IMAGE_NAME - the name of the Docker image for the specific Docker registry
#--     $IMAGE_TAG - the tag for versioning (e.g., 1.0)
# 
# arcbrth@gmail.com | ClusterBR (c) 2025
#-------------------------------------------------------------------------------------------

FROM ubuntu:latest

WORKDIR /app

COPY phasorz /app/
COPY web /app/web/

RUN ls -l /app
RUN ls -l /app/web

#-- The exposed port where the app is listening. Change this port to your desired port.
EXPOSE 10000

RUN chmod +x /app/phasorz

#-- The port specified in EXPOSE should match the app's internal port.
#-- Change the application port parameter as needed (e.g. --port=8080).

ENTRYPOINT ["/app/phasorz", "--web", "--port=10000"]

