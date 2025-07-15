import express from 'express'
import { auth } from '../middleware/auth.middleware.js'
import { createCart } from '../controllers/cart.controller.js'

const cartRouter = express.Router()
cartRouter.post('/create',auth ,createCart)


export default cartRouter