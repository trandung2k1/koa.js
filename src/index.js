const Koa = require('koa');
const dotenv = require('dotenv');
dotenv.config();
const helmet = require('koa-helmet');
const morgan = require('koa-morgan');
const { koaBody } = require('koa-body');
const path = require('path');
const cors = require('@koa/cors');
const colors = require('colors');
const { mkdirp } = require('mkdirp');
const fs = require('fs');
const connectDB = require('./configs/db');
const book = require('./routes/book.route');
const author = require('./routes/author.route');
const port = process.env.PORT || 4000;
mkdirp.sync('src/logs');
const accessLogStream = fs.createWriteStream(path.join(__dirname, '/logs/access.log'), {
    flags: 'a',
});
const app = new Koa();
app.use(koaBody());
app.use(cors());
app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(book.routes()).use(book.allowedMethods());
app.use(author.routes()).use(author.allowedMethods());
app.use((ctx) => {
    ctx.status = 404;
    ctx.body = {
        status: 404,
        message: `Router ${ctx.originalUrl} not found`,
    };
});

app.listen(port, async () => {
    await connectDB();
    console.log(colors.green(`Server listening http://localhost:${port}`));
});
