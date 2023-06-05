const mongoose = require('mongoose')
const User = require('./user')
const Courses = require('./courses')


const OrderSchema = new mongoose.Schema({
  orderDate: {
    type: Date,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    require: true
  },
  Cours:[ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courses',
    required: true
  }],
  montant:{
    type:Number,
    required: true
  }
},
  { timestamps: true }
)

module.exports = mongoose.model("Order", OrderSchema)