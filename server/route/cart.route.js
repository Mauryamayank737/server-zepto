import express from 'express'
import { auth } from '../middleware/auth.middleware.js'
import { addToCartItem, getCartItem } from '../controllers/cart.controller.js'

const cartRouter = express.Router()
cartRouter.post('/add',auth ,addToCartItem)
cartRouter.get('/list',auth,getCartItem)


export default cartRouter