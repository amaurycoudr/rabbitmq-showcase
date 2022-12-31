import amqp from 'amqplib';

(async () => {
    const queue = 'tasks';

    // Wait for rabbitmq to start TODO: find a better way
    await new Promise(resolve => setTimeout(resolve, 8000));

    const conn = await amqp.connect('amqp://rabbitmq').catch(function (error) {
        console.error('%s while dialing rabbitmq', error);
        process.exit(1);
    });
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
