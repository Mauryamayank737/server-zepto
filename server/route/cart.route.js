import express from 'express'
import { auth } from '../middleware/auth.middleware.js'
import { addToCartItem, decCartItem, deleteOneCart, getCartItem } from '../controllers/cart.controller.js'

const cartRouter = express.Router()
cartRouter.post('/add',auth ,addToCartItem)
cartRouter.get('/list',auth,getCartItem)
cartRouter.post('/decrement', auth ,decCartItem)
cartRouter.post('/deleteOne', auth ,deleteOneCart)


export default cartRouter