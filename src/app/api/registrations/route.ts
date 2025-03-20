import { NextResponse } from 'next/server';

// В реальном приложении здесь была бы база данных
let registrations: any[] = [];

export async function GET() {
  return NextResponse.json(registrations);
}

export async function POST(request: Request) {
  const data = await request.json();
  const newRegistration = {
    ...data,
    id: Date.now(),
    timestamp: new Date().toISOString(),
    paymentConfirmed: false
  };
  registrations.push(newRegistration);
  return NextResponse.json(newRegistration);
}

export async function PUT(request: Request) {
  const data = await request.json();
  const index = registrations.findIndex(reg => reg.id === data.id);
  if (index !== -1) {
    registrations[index] = { ...registrations[index], ...data };
    return NextResponse.json(registrations[index]);
  }
  return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
}

// Добавляем функцию для очистки всех регистраций
export async function DELETE() {
  registrations = [];
  return NextResponse.json({ message: 'All registrations cleared' });
} 