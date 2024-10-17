const express = require('express');
const { app, server } = require('./socket/socket.js');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI;
const path = require('path');

const userRouter = require('./routes/userRoute.js');
const passwordRouter = require('./routes/password.js');
const bgRouter = require('./routes/bgImage.js');
const profileRouter = require('./routes/profileImage.js');
const aboutRouter = require('./routes/about.js');
const educationRouter = require('./routes/education.js');
const experienceRouter = require('./routes/experience.js');
const createPostRouter = require('./routes/createPost.js');
const adminRouter = require('./routes/admin.js')
const createJobRoute = require('./routes/createJob.js')
const jobApplication = require('./routes/jobApplication.js')
const messageRoutes = require('./routes/message.js');
const notificationRouter = require('./routes/notification.js')
const connectionRouter = require('./routes/connectionRequest.js')



app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', userRouter);
app.use('/', passwordRouter);
app.use('/', bgRouter);
app.use('/', profileRouter);
app.use('/', aboutRouter);
app.use('/', educationRouter);
app.use('/', experienceRouter);
app.use('/', createPostRouter);
app.use('/', adminRouter);
app.use('/', createJobRoute);
app.use('/',jobApplication)
app.use('/',messageRoutes);
app.use('/',notificationRouter)
app.use('/',connectionRouter)



mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database Connected');
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
