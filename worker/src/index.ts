import amqp from 'amqplib';
import mongoose from 'mongoose';
import { Order } from './Order';

(async () => {
    const queue = 'tasks';

    // Wait for rabbitmq to start TODO: find a better way
    await new Promise(resolve => setTimeout(resolve, 8000));

    const connection = await amqp.connect('amqp://rabbitmq')
    const listener = await connection.createChannel();
    console.log('Connected to rabbitmq');

    // Connect to mongo with mongoose
    await mongoose.connect('mongodb://db:27017/test')
    console.log('Connected to mongo');


    await listener.assertQueue(queue);

    listener.consume(queue, (msg: any) => {
        if (msg !== null) {
            const data = JSON.parse(msg.content.toString());
            console.log('Recieved:', data);
            if (data.task === 'CREATE_ORDER') {
                // do fake work
                setTimeout(async () => {
                    const order = await Order.findById(data.data._id);
                    if (order) {
                        order.orderStatus = 'complete';
                        await order.save();
                    }
                    console.log('Order complete');
                    listener.ack(msg);
                }, 5000);
            }
        } else {
            console.log('Consumer cancelled by server');
        }
    });
})();
