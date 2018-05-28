apt-get install docker.io
docker build -t server03 .
docker run -p 50103:50103 server03