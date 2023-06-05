const Order = require('../models/ordre')

const NewOrdre = async (orderDate, userId, detail) => {
    const newOrder = await Order.create({ orderDate, user: userId, detail });
    return newOrder
}

const createOrder = async (req,res) => {
    const order= await Order.create(req.body);
    res.status(201).send(order)
}
const getAllOrders = async () => {
    const result = await Order.find().populate({
        path: 'user',
        select: ['name', 'lastname',"picture",'_id']})
    return result
}

const getOrderById = async (id) => {
    const result = await Order.findOne({ _id: id })
        .populate({ path: 'user', select: 'fullName' })
        .populate({ path: 'detail', populate: { path: 'course', select: 'label brand price' } })
        .exec()
    return result
}

const cancelAnOrder = async (id) => {
    const result = await Order.findOneAndUpdate({ _id: id }, { $set: { status: "Canceled" } }).exec()
    return result;
}

const getMyOrders = async (userId) => {
    const result = await Order.find({ user: userId })
        .populate({ path: 'user', select: 'fullName' })
        .populate({ path: 'detail', populate: { path: 'course', select: 'label brand price' } })
        .exec()
    return result
}

module.exports = {
    NewOrdre,
    getAllOrders,
    getOrderById,
    cancelAnOrder,
    getMyOrders,
    createOrder
}