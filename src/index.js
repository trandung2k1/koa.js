const Koa = require('koa');
const dotenv = require('dotenv');
dotenv.config();
const helmet = require('koa-helmet');
const morgan = require('koa-morgan');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors');
const colors = require('colors');
const fs = require('fs');
const connectDB = require('./configs/db');
const isProduction = process.env.NODE_ENV === 'production';
const accessLogStream = fs.createWriteStream(__dirname + '/logs/access.log', {
    flags: 'a',
});
const port = process.env.PORT || 4000;
const app = new Koa();
app.use(koaBody());
app.use(isProduction ? morgan('combined', { stream: accessLogStream }) : morgan('tiny'));
app.use(cors());
app.use(helmet());
app.use((ctx) => {
    ctx.body = {
        message: 'Welcome to server 👋👋',
    };
});

app.listen(port, async () => {
    await connectDB();
    console.log(colors.green(`Server listening http://localhost:${port}`));
});
