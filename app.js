`use strict`;

require('dotenv').config();
require('./utils/mongoDB'); // Initialized Database
const cors = require('cors');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const { APP_PORT, SECRET } = require('./utils/constants');
const { isAuthenticatedRequest } = require('./src/controllers/authorizationController');


app.listen(APP_PORT, () => console.log(`Server Running at http://localhost:${APP_PORT}`));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser(SECRET));
app.use(express.urlencoded({ extended: true }));

//Unprotected Routes
app.get(['/', '/ping'], (req, res) => res.send('pong'));
app.use(['/authenticate'], require('./src//apis/authorizationIndex').routerUnprotected);
app.use(['/user'], require('./src/apis/userIndex').routerUnprotected);

//Protected Routes
app.use('/protected', isAuthenticatedRequest);
app.use(['/protected/user'], require('./src/apis/userIndex').protectedRouter);
app.use(['/protected/following'], require('./src/apis/followingIndex').protectedRouter);
app.use(['/protected/post'], require('./src/apis/postIndex').protectedRouter);


