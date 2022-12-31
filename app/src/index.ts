import amqp from 'amqplib';

import express from 'express';
import mongoose from 'mongoose';
import { Order } from './Order';

const app = express();
app.use(express.json());

let channel: amqp.Channel;

const queue = 'tasks';


app.get('/', (req, res) => {
    console.log("[GET] /");
    res.send('Hello World');
});

app.post('/orders', (req, res) => {
    console.log("[POST] /orders");
    console.log(req.body);

    const order = new Order({
        email: req.body?.email,
        orderStatus: 'pending',
    });
    order.save();

    channel.sendToQueue(queue, Buffer.from(JSON.stringify({
        task: "CREATE_ORDER", data: order
    })));

    res.send(order).status(201);
});

app.get('/orders', async (req, res) => {
    const orders = await Order.find()
    res.send(orders);
});

app.get('/orders/:id', async (req, res) => {
    const id = req.params.id;
    console.log("[GET] /order/" + id);
    try {
        const order = await Order.findById(id);
        res.send(order);
    } catch {
        res.status(404).send();
    }

});

app.listen(3000, async () => {

    // Wait for rabbitmq to start TODO: find a better way
    await new Promise(resolve => setTimeout(resolve, 8000));

    // Connect to rabbitmq
    const connection = await amqp.connect('amqp://rabbitmq')
    channel = await connection.createChannel();
    console.log('Connected to rabbitmq');

    // Connect to mongo with mongoose
    await mongoose.connect('mongodb://db:27017/test')
    console.log('Connected to mongo');

    console.log('Server started on port 3000');
});

