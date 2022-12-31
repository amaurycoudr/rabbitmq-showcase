import * as mongoose from 'mongoose';

export interface OrderModel extends mongoose.Document {
    email: string;
    orderStatus: 'pending' | 'complete';
}

const orderSchema = new mongoose.Schema({
    email: { type: String, required: true },
    orderStatus: { type: String, required: true, enum: ['pending', 'complete'] },
});

export const Order = mongoose.model<OrderModel>('Order', orderSchema);
