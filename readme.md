-> API 
-> DB
-> Docker
-> rabbitmq
-> worker

# Orders Service

The aim of the project is to create an order app that will handle order requests send by a customer.
The customer will be able to send an order resquest, to get all orders and to get a specified order.
On top of that we want a fast answer by our API but handling an order could be time consuming in a case of high demand.
Thus, we will use rabbitmq to handle the message process. It will ensure a fast response to the customer and that the order
will be procceed lately by the worker.

# Project dependency

To run the project you will need docker on your computer.
Find below a link to the docker documentation to install and getting started with docker
https://docs.docker.com/engine/

# Run the project


