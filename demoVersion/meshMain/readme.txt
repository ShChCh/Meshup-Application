apt-get install docker.io
docker build -t comp9900 .
docker run -p 80:80 comp9900