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
const { createServer } = require('http');
const { Server } = require('socket.io');
const render = require('@koa/ejs');
const fs = require('fs');
const connectDB = require('./configs/db');
const book = require('./routes/book.route');
const author = require('./routes/author.route');
const site = require('./routes/site.route');
const port = process.env.PORT || 4000;
mkdirp.sync('src/logs');
const accessLogStream = fs.createWriteStream(path.join(__dirname, '/logs/access.log'), {
    flags: 'a',
});
const app = new Koa();
render(app, {
    root: path.join(__dirname, 'views'),
    viewExt: 'ejs',
    cache: false,
    // debug: true
});
const server = createServer(app.callback());
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
app.use(koaBody());
app.use(cors());
app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(book.routes()).use(book.allowedMethods());
app.use(author.routes()).use(author.allowedMethods());
app.use(site.routes()).use(site.allowedMethods());
app.use((ctx) => {
    ctx.status = 404;
    ctx.body = {
        status: 404,
        message: `Router ${ctx.originalUrl} not found`,
    };
});
io.on('connection', (socket) => {
    console.log(socket.id + ' connected');
    socket.on('disconnect', () => {
        console.log(socket.id + ' disconnected');
    });
});

server.listen(port, async () => {
    await connectDB();
    console.log(colors.green(`Server listening http://localhost:${port}`));
});
