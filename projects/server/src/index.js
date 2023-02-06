const express = require('express');
const cors = require('cors');
const { join } = require('path');
const db = require('./models');
const { verifyToken } = require('./middlewares/authMiddleware');
const { sequelize } = require('./models');
const fs = require('fs');
const path = require('path');
dotenv = require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

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
} = require('./routes');

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
app.use('/public', express.static(path.join(__dirname, 'public')));

//#region API ROUTES

// ===========================
// NOTE : Add your routes here

app.use('/api/admin', verifyToken, adminCategory);
app.use('/api/userData', userdata);
app.use('/api/product', product);
app.use('/api/categories', category);
app.use('/api/auth', auth);
app.use('/api/shipment', shipment);
app.use('/api/profile', verifyToken, profile);
app.use('/api/admin/product', verifyToken, adminProduct);
app.use('/api/warehouse', verifyToken, adminWarehouse);
app.use('/api/address', address);
app.use('/api/stock', stock);
app.use('/api/carts', verifyToken, cart);
app.use('/api/checkoutAddress', addressCheckout);
app.use('/api/user-profile', verifyToken, userProfile);
app.use('/api/transactions', verifyToken, transactions);
app.use('/api/adminOrder', verifyToken, adminOrder);
app.use('/api/export', verifyToken, exports1);
app.use('/api/admin/order-history', adminOrderHistory);
app.use('/api/stock-mutation', verifyToken, stockMutation);
app.use('/api/admin/sales-report', salesReport);

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
    // db.sequelize.sync({ alter: true });
//     if (!fs.existsSync('./src/public')) {
//       fs.mkdirSync('./src/public');
//     }
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
