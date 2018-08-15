# Meshup-Application
MeshupApp

For developers:

Modify dev folder to fetch any data sources you like and follow the format in meshup main js file to change your data structures.
This app could be modified to let you quickly finish a meshup demo.

For users who wanna deploy:

This project could be deployed in numbers of servers:
1. use docker to deploy servers based on data sources folders ( for example, you could deploy 3 servers based on 'server' folders in this demo ) , following the folder name to check the publisher
2. add your own data sources, maybe just copy an existed folder and change files in it.
3. client folder could be used in any places, even no need to deploy a LAMP server.
4. if you wanna to show the html page in your website, just copy the client folder into /var/www/html folder in your linux and change DNS to check it.
