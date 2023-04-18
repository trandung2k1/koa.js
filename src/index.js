const Koa = require('koa');
const dotenv = require('dotenv');
dotenv.config();
const helmet = require('koa-helmet');
const morgan = require('koa-morgan');
const { koaBody } = require('koa-body');
const path = require('path');
const cors = require('@koa/cors');
const colors = require('colors');
const fs = require('fs');
const connectDB = require('./configs/db');
const port = process.env.PORT || 4000;
fs.promises.mkdir('src/logs', { recursive: true }).catch(console.error);
const accessLogStream = fs.createWriteStream(path.join(__dirname, '/logs/access.log'), {
    flags: 'a',
});
const app = new Koa();
app.use(koaBody());
app.use(cors());
app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));
app.use((ctx) => {
    ctx.body = {
        message: 'Welcome to server 👋👋',
    };
});

app.listen(port, async () => {
    await connectDB();
    console.log(colors.green(`Server listening http://localhost:${port}`));
});
