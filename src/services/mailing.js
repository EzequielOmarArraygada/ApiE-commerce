import config from '../config/config.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: config.mailing.SERVICE,
    auth: {
        user: config.mailing.USER, 
        pass: config.mailing.PASSWORD
    }
});

export function sendPasswordResetEmail(email, token) {
    const resetLink = `http://localhost:8080/api/sessions/reset-password?token=${token}`;
    const mailOptions = {
        from: config.mailing.USER,
        to: email,
        subject: 'Restablecimiento de contraseña',
        html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetLink}">Restablecer contraseña</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
}

export async function sendEmail(emailDetails) {
    const mailOptions = {
        from: config.mailing.USER,
        to: emailDetails.to,
        subject: emailDetails.subject,
        text: emailDetails.text
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado:', info.response);
        return info;
    } catch (error) {
        console.error('Error al enviar correo:', error);
        throw error;
    }
}