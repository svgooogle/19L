'use client';
import { useState, useEffect } from 'react';

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

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/registrations');
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data);
      } else {
        setError('Ошибка при загрузке данных');
      }
    } catch {
      setError('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (id: number) => {
    try {
      const response = await fetch('/api/registrations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, paymentConfirmed: true }),
      });
      if (response.ok) {
        await fetchRegistrations();
      }
    } catch {
      console.error('Ошибка при подтверждении оплаты');
      alert('Ошибка при подтверждении оплаты');
    }
  };

  const sendInvitation = async (registration: Registration) => {
    try {
      const response = await fetch('/api/send-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: registration.id,
          name: registration.name,
          email: registration.email,
        }),
      });

      if (response.ok) {
        // Обновляем статус отправки приглашения
        await fetch('/api/registrations', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: registration.id, invitationSent: true }),
        });
        await fetchRegistrations();
        alert('Приглашение успешно отправлено!');
      } else {
        throw new Error('Failed to send invitation');
      }
    } catch {
      console.error('Ошибка при отправке приглашения');
      alert('Ошибка при отправке приглашения');
    }
  };

  const getPaymentAmount = (drinkChoice: string) => {
    return drinkChoice === 'common' ? 2800 : 2000;
  };

  const getStats = () => {
    const confirmedRegistrations = registrations.filter(reg => reg.paymentConfirmed);
    const totalAmount = confirmedRegistrations.reduce((sum, reg) => sum + getPaymentAmount(reg.drinkChoice), 0);
    return {
      confirmedCount: confirmedRegistrations.length,
      totalAmount
    };
  };

  if (loading) return <div className="p-8 text-center">Загрузка...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Панель администратора</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Подтвержденных участников</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.confirmedCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Собрано денег</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalAmount} ₽</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Имя</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">JBL</th>
                  <th className="px-6 py-3 text-left">Напитки</th>
                  <th className="px-6 py-3 text-left">Сумма</th>
                  <th className="px-6 py-3 text-left">Дата</th>
                  <th className="px-6 py-3 text-left">Статус</th>
                  <th className="px-6 py-3 text-left">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{reg.name}</td>
                    <td className="px-6 py-4">{reg.email}</td>
                    <td className="px-6 py-4">{reg.hasJBL ? '✅' : '❌'}</td>
                    <td className="px-6 py-4">
                      {reg.drinkChoice === 'common' ? 'Общий алкоголь' : 'Свой алкоголь'}
                    </td>
                    <td className="px-6 py-4">{getPaymentAmount(reg.drinkChoice)} ₽</td>
                    <td className="px-6 py-4">
                      {new Date(reg.timestamp).toLocaleString('ru-RU')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div>
                          {reg.paymentConfirmed ? (
                            <span className="text-green-600 font-medium">Оплачено</span>
                          ) : (
                            <span className="text-yellow-600 font-medium">Ожидает оплаты</span>
                          )}
                        </div>
                        {reg.invitationSent && (
                          <div>
                            <span className="text-blue-600 text-sm">Приглашение отправлено</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {!reg.paymentConfirmed && (
                          <button
                            onClick={() => confirmPayment(reg.id)}
                            className="block w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                          >
                            Подтвердить оплату
                          </button>
                        )}
                        {reg.paymentConfirmed && !reg.invitationSent && (
                          <button
                            onClick={() => sendInvitation(reg)}
                            className="block w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                          >
                            Отправить приглашение
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 