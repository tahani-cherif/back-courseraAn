const express = require('express')
const router = express.Router()
const authentificate = require('../middellware/authentification')
const orderControlleur = require('../controlleur/ordre')
const authenticate = require('../middellware/authentification')
const isAdmin=require('../middellware/isAdmin')

//a discuter


// router.post('/createOrder', authentificate, async (req, res) => {
//     const userId = req.user.user_id
//     const { details } = req.body;
//     try {
//         const result = await orderControlleur.NewOrdre(new Date(), userId, details)
//         res.json({ message: "Order added successfully", data: result })
//     } catch (error) {
//         res.status(400).json({ error: error.message })
//     }
// })

router.get('/getUserOrder', authenticate, async (req, res) => {
    const userId = req.user.user_id

    try {
        const result = await orderControlleur.getMyOrders(userId)
        res.json({ message: "Your Orders", data: result })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})
//isAdmin,authenticate
router.get('/getOrders', async (req, res) => {

    try {
        const result = await orderControlleur.getAllOrders()
        res.json({ message: "All Orders", data: result })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.put('/updateOrder/:id', orderControlleur.cancelAnOrder); 
router.post('/createorder', orderControlleur.createOrder); 
router.delete('/deleteOrder/:id', orderControlleur.getOrderById);

module.exports = router;