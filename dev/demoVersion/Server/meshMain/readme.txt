apt-get install docker.io
docker build -t server00 .
docker run -p 80:80 server00