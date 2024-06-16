const express = require('express');
const session = require('express-session');
const app = express();
const dbConnection = require('./src/config/db');
const PORT = process.env.PORT ;
const cors = require('cors');
const routerProduct = require('./src/routes/productRoutes');
const routerUser = require('./src/routes/usersRoutes');
const router = require('./src/routes/Commentroutes.js');
const { hashedSecret } = require('./src/config/secret');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dbConnection();

app.use(session({
  secret: hashedSecret,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(cors());

app.use('/productos', routerProduct);
app.use('/user', routerUser);
app.use('/comment', router);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

