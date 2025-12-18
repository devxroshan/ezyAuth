import { createTransport } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

export const mailTransporter = createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

mailTransporter.use('compile', hbs({
    viewEngine: {
        extname: '.hbs',
        partialsDir: path.resolve('./src/template'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./src/template'),
    extName: '.hbs',
}));