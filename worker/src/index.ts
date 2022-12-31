import amqp from 'amqplib';

(async () => {
    const queue = 'tasks';
    const conn = await amqp.connect('amqp://rabbitmq');

    const listener = await conn.createChannel();
    await listener.assertQueue(queue);


    listener.consume(queue, (msg: any) => {
        if (msg !== null) {
            const data = JSON.parse(msg.content.toString());
            console.log('Recieved:', data);
            if (data.task === 'CREATE_ORDER') {
                // do fake work
                setTimeout(() => {
                    console.log('Order created');
                    listener.ack(msg);
                }, 5000);
            }
        } else {
            console.log('Consumer cancelled by server');
        }
    });
})();
