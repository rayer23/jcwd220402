const express = require('express');
const cors = require('cors');
const { join } = require('path');
const db = require('../models');
const { verifyToken } = require('../middlewares/authMiddleware');

require('dotenv/config');
const fs = require('fs');

// Import Routes
const {
  address,
  adminProduct,
  adminWarehouse,
  auth,
  product,
  profile,
  shipment,
  stock,
  userdata,
  cart,
  addressCheckout,
  category,
  userProfile,
  transactions,
  adminOrder,
  exports1,
  adminOrderHistory,
  stockMutation,
  salesReport,
  adminCategory,
} = require('../routes');

const PORT = process.env.PORT || 8000;
const app = express();
app.use(
  cors(),
  //     {
  //     origin: [
  //         process.env.WHITELISTED_DOMAIN &&
  //             process.env.WHITELISTED_DOMAIN.split(","),
  //     ],
  // }
);

app.use(express.json());

//#region API ROUTES

// ===========================
// NOTE : Add your routes here
app.use('/admin', verifyToken, adminCategory);
app.use('/userData', userdata);
app.use('/product', product);
app.use('/categories', category);
app.use('/auth', auth);
app.use('/shipment', shipment);
app.use('/profile', verifyToken, profile);
app.use('/admin/product', verifyToken, adminProduct);
app.use('/warehouse', verifyToken, adminWarehouse);
app.use('/public', express.static('public'));
app.use('/address', address);
app.use('/stock', stock);
app.use('/carts', verifyToken, cart);
app.use('/checkoutAddress', addressCheckout);
app.use('/user-profile', verifyToken, userProfile);
app.use('/transactions', verifyToken, transactions);
app.use('/adminOrder', verifyToken, adminOrder);
app.use('/export', verifyToken, exports1);
app.use('/admin/order-history', adminOrderHistory);
app.use('/stock-mutation', verifyToken, stockMutation);
app.use('/admin/sales-report', salesReport);

app.get('/api', (req, res) => {
  res.send(`Hello, this is my API`);
});

app.get('/api/greetings', (req, res, next) => {
  res.status(200).json({
    message: 'Hello, Student !',
  });
});

// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes('/api/')) {
    res.status(404).send('Not found !');
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes('/api/')) {
    console.error('Error : ', err.stack);
    res.status(500).send('Error !');
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = '../../client/build';
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, clientPath, 'index.html'));
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    // db.sequelize.sync({ alter: true })
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public');
    }
    console.log(`Server running at PORT : ${PORT}`);
  }
});
