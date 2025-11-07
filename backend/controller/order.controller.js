const Order = require('../model/orders.model');


// [GET] /orders/:id
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const orders = await Order.findOne({ _id: id })
            .populate({
                path: 'order_details',
                populate: {
                    path: 'flight_id',
                    model: 'Flight',
                    select: '-seat_layout' // dấu trừ "-" để loại bỏ field
                }
            });
        res.json({
            status: "200",
            data: orders
        });
    }
    catch (err) {
        res.json({
            status: "500",
            message: "Internal Server Error"
        });
    }
}