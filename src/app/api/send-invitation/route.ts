import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import QRCode from 'qrcode';

// Настройка транспорта для отправки email через Яндекс
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true, // Используем SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { name, email, id } = await request.json();

    // Создаем данные для QR-кода
    const qrData = JSON.stringify({
      id: id,
      name: name,
      type: 'party-invitation'
    });

    // Генерируем QR-код в формате Data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);

    // HTML шаблон письма
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #6B46C1; text-align: center;">19 литров счастья</h1>
        <h2 style="text-align: center;">Приглашение на бухич</h2>
        
        <p>Привет, ${name}!</p>
        
        <p>Мы рады подтвердить получение оплаты и приглашаем тебя на наш бухич!</p>
        
        <div style="background-color: #F3E8FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #6B46C1; margin-top: 0;">Детали мероприятия:</h3>
          <p><strong>Дата:</strong> 6 апреля 2025</p>
          <p><strong>Время:</strong> 16:00</p>
          <p><strong>Адрес:</strong> 2-я Ипподромная улица, 24Б</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="margin-bottom: 15px;"><strong>Твой QR-код для входа:</strong></p>
          <img src="${qrCodeDataUrl}" alt="QR Code" style="max-width: 200px;"/>
        </div>
        
        <p style="background-color: #EDF2F7; padding: 15px; border-radius: 8px;">
          ⚠️ Сохрани этот QR-код – он понадобится для входа на мероприятие!
        </p>
        
        <p>До встречи на бухиче! 🎉</p>
      </div>
    `;

    // Отправляем email
    await transporter.sendMail({
      from: `"19 литров счастья" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Приглашение на бухич - 19 литров счастья',
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending invitation:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    );
  }
} 