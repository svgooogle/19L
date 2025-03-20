import { NextResponse } from 'next/server';

interface Registration {
  id: number;
  name: string;
  email: string;
  hasJBL: boolean;
  drinkChoice: string;
  timestamp: string;
  paymentConfirmed: boolean;
  invitationSent?: boolean;
}

// В реальном приложении здесь была бы база данных
let registrations: Registration[] = [];

export async function GET() {
  return NextResponse.json(registrations);
}

export async function POST(request: Request) {
  const data = await request.json();
  const newRegistration: Registration = {
    ...data,
    id: Date.now(),
    timestamp: new Date().toISOString(),
    paymentConfirmed: false
  };
  registrations.push(newRegistration);
  return NextResponse.json(newRegistration);
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const index = registrations.findIndex(reg => reg.id === data.id);
    if (index !== -1) {
      registrations[index] = { ...registrations[index], ...data };
      return NextResponse.json(registrations[index]);
    }
    return NextResponse.json({ message: 'Registration not found' }, { status: 404 });
  } catch {
    return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
  }
}

// Добавляем функцию для очистки всех регистраций
export async function DELETE() {
  registrations = [];
  return NextResponse.json({ message: 'All registrations cleared' });
} 