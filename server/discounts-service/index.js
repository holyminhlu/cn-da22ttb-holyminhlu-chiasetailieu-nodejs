const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const discountRoute = require('./routes/discountRoute')

const app = express()
const PORT = 3003

// Middlewares
app.use(cors())
app.use(express.json())

// Kết nối tới MongoDB
mongoose.connect('mongodb+srv://nguyenhuuluan19092004zz:DtZp6M56ZYgYqprV@clustercheaptrip.fct1xpg.mongodb.net/DiscountsCheapTripDB')
    .then(() => console.log('Kết nối tới DiscountsCheapTripDB thành công!'))
    .catch(err => console.error('Lỗi kết nối MongoDB:', err))

// Sử dụng routes
app.use('/', discountRoute)

app.get('/', (req, res) => {
    res.send('Discounts-Service của CheapTrip đang chạy')
})

app.listen(PORT, () => {
    console.log(`Discounts-Service đang lắng nghe tại http://localhost:${PORT}`)
})