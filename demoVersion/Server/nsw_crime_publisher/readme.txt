apt-get install docker.io
docker build -t server02 .
docker run -p 50102:50102 server02