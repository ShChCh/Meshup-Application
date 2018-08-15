apt-get install docker.io
docker build -t meshAppJoey .
docker run -p 80:80 meshAppJoey
