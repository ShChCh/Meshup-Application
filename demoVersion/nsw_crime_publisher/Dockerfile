# Use an official Python runtime as a parent image
FROM python:3.6-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Make port 50102 available to the world outside this container
EXPOSE 50102

# Define environment variable
ENV NAME World

# Run app.py when the container launches
CMD ["python", "nsw_crime_publisher.py"]
