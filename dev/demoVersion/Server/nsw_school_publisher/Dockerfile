# Use an official Python runtime as a parent image
FROM python:3.6-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Make port 50103 available to the world outside this container
EXPOSE 50103

# Define environment variable
ENV NAME World

# Run nsw_public_school_data_publisher.py when the container launches
CMD ["python", "nsw_public_school_data_publisher.py"]
