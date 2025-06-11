import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { to, subject, html } = await request.json();

        // Configure o transportador do Nodemailer com suas credenciais SMTP
        // As credenciais são lidas de forma segura das variáveis de ambiente
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_PORT === '465', // true para a porta 465, false para as outras
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"Yallah" <${process.env.SMTP_USER}>`, // Endereço de e-mail do remetente
            to: to,
            subject: subject,
            html: html,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'E-mail enviado com sucesso!' }, { status: 200 });
    } catch (error) {
        console.error(error);
        // Verifique se o erro é uma instância de Error para acessar a propriedade message
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        return NextResponse.json({ error: 'Falha ao enviar e-mail', details: errorMessage }, { status: 500 });
    }
} 