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
}

export default function Stats() {
  const [stats, setStats] = useState({
    confirmedCount: 0,
    totalAmount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/registrations');
        if (response.ok) {
          const registrations: Registration[] = await response.json();
          const confirmedRegistrations = registrations.filter(reg => reg.paymentConfirmed);
          const totalAmount = confirmedRegistrations.reduce((sum, reg) => 
            sum + (reg.drinkChoice === 'common' ? 2800 : 2000), 0);

          setStats({
            confirmedCount: confirmedRegistrations.length,
            totalAmount
          });
        }
      } catch (error) {
        console.error('Ошибка при загрузке статистики:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return null;

  return (
    <div className="bg-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Участников</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.confirmedCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Собрано денег</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalAmount} ₽</p>
          </div>
        </div>
      </div>
    </div>
  );
} 