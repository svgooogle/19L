import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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

const DATA_FILE = path.join(process.cwd(), 'data', 'registrations.json');

// Убедимся, что директория существует
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Загрузка регистраций из файла
async function loadRegistrations(): Promise<Registration[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Сохранение регистраций в файл
async function saveRegistrations(registrations: Registration[]) {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(registrations, null, 2));
}

export async function GET() {
  const registrations = await loadRegistrations();
  return NextResponse.json(registrations);
}

export async function POST(request: Request) {
  const registrations = await loadRegistrations();
  const data = await request.json();
  const newRegistration: Registration = {
    ...data,
    id: Date.now(),
    timestamp: new Date().toISOString(),
    paymentConfirmed: false
  };
  registrations.push(newRegistration);
  await saveRegistrations(registrations);
  return NextResponse.json(newRegistration);
}

export async function PUT(request: Request) {
  try {
    const registrations = await loadRegistrations();
    const data = await request.json();
    const index = registrations.findIndex(reg => reg.id === data.id);
    if (index !== -1) {
      registrations[index] = { ...registrations[index], ...data };
      await saveRegistrations(registrations);
      return NextResponse.json(registrations[index]);
    }
    return NextResponse.json({ message: 'Registration not found' }, { status: 404 });
  } catch {
    return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
  }
}

export async function DELETE() {
  await saveRegistrations([]);
  return NextResponse.json({ message: 'All registrations cleared' });
} 