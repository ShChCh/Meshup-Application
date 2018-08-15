# Meshup-Application
MeshupApp

For developers:

Modify dev folder to fetch any data sources you like and follow the format in meshup main js file to change your data structures.
This app could be modified to let you quickly finish a meshup demo.

For users who wanna deploy:

This project could be deployed in numbers of servers:
1. use docker to deploy servers based on data sources folders ( for example, you could deploy 3 different servers based on 'server' folders in this demo, but you may need to check and modify IP address in those server .py files or just change it to let cmd line args input the addresses ) , and you could follow those folder names to check the publisher
2. adding your own data sources could be simple, maybe just copy an existed folder and change files in it ( docker setting files and .py main adaptor files).
3. the client folder could be used in any places, even no need to deploy a LAMP server.
4. if you wanna to show the html page in your website, just copy the client folder into /var/www/html folder in your linux and change DNS to check it.
