import cors from "cors"
import express from 'express'
import { v4 } from "uuid"
const app = express()
const port = 3001
app.use(express.json())
app.use(cors())
const orders = []

// Checa se o ID é verdadeiro ou Falso
const checkId = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ erro: "Oreder Not Found" })
    }

    request.orderId = id
    request.orderIndex = index

    next()
}

// Mostra a URL e o Método
const url = (req, res, next) => {
    const { url, method } = req
    console.log(`URL: ${url}, Method: ${method}`)

    next()
}

// Criação dos Pedidos
app.post('/order', url, (request, response) => {
    const { order, clientName, price, status } = request.body

    const o = { id: v4(), order, clientName, price, status }

    orders.push(o)

    return response.status(201).json(orders)
})

// Recebe todos os Pedidos
app.get('/order', url, (request, response) => {
    return response.json(orders)
})

// Atualiza o Pedido pelo seu ID
app.put('/orders/:id', checkId, url, (request, response) => {
    const { order, clientName, price, status } = request.body
    const id = request.orderId
    const index = request.orderIndex

    const updateOrder = { id, order, clientName, price, status }

    orders[index] = updateOrder

    return response.status(201).json(updateOrder)
})

// Deleta todo o Pedido
app.delete('/order/:id', checkId, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

// Recebe um Pedido pelo Id
app.get('/order/:id', checkId, url, (request, response) => {
    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)

    return response.json(orders[index])
})

// Atualiza os Status do Pedido
app.patch('/order/:id', checkId, url, (request, response) => {
    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)
    orders[index].status = 'Pronto'

    return response.json(orders[index])
})




app.listen(port, () => {
    console.log(`Server Started in: ${port}`)
})