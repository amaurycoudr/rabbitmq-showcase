import amqp from 'amqplib';

import express from 'express';

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
    channel.sendToQueue(queue, Buffer.from(JSON.stringify({
        task: "CREATE_ORDER", data: {
            name: req.body?.name,
        }
    })));
    res.send('Order created').status(201);
});

app.get('/orders', (req, res) => {
    res.send('Order list');
});

app.get('/orders/:id', (req, res) => {
    const id = req.params.id;
    console.log("[GET] /order/" + id);
    res.send('Order details');
});

app.listen(3000, async () => {

    // Wait for rabbitmq to start TODO: find a better way
    await new Promise(resolve => setTimeout(resolve, 8000));

    // Connect to rabbitmq
    const connection = await amqp.connect('amqp://rabbitmq').catch(function (error) {
        console.error('%s while dialing rabbitmq', error);
        process.exit(1);
    });
    channel = await connection.createChannel();

    // Connect to mongo


    console.log('Server started on port 3000');
});

