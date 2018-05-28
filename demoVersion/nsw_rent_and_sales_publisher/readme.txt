apt-get install docker.io
docker build -t server01 .
docker run -p 50101:50101 server01