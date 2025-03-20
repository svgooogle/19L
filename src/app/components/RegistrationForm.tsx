'use client';
import { useState } from 'react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    hasJBL: false,
    drinkChoice: ''
  });

  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSent, setPaymentSent] = useState(false);

  const handleSubmit = async (drinkChoice: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...formData, drinkChoice}),
      });
      if (response.ok) {
        setFormData(prev => ({ ...prev, drinkChoice }));
        setShowPayment(true);
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentAmount = () => {
    return formData.drinkChoice === 'common' ? 2800 : 2000;
  };

  if (showPayment) {
    return (
      <section id="register" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-purple-50 rounded-lg shadow-lg p-6">
            {!paymentSent ? (
              <>
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Информация об оплате</h2>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-lg font-semibold mb-2 text-gray-900">Сумма к оплате: {getPaymentAmount()} ₽</p>
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">Реквизиты для перевода:</p>
                      <p className="bg-white p-4 rounded border border-gray-200 text-gray-900 text-lg">
                        <span className="font-semibold block mb-2">+7 995 858 83 05</span>
                        <span className="block">Т-Банк</span>
                        <span className="block">Тимофей К.</span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <p className="text-gray-900">
                      После оплаты мы отправим подтверждение на указанный email: <span className="font-medium">{formData.email}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setPaymentSent(true)}
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                  >
                    Я скинул
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Спасибо!</h2>
                <div className="bg-purple-100 p-6 rounded-lg">
                  <p className="text-lg text-gray-900">
                    Ожидайте, после подтверждения вы получите приглашение на E-Mail
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Регистрация на вечеринку</h2>
        <div className="max-w-md mx-auto bg-purple-50 rounded-lg shadow-lg p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-900 mb-2 font-medium">
                Имя
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-gray-900 mb-2 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                required
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="hasJBL"
                checked={formData.hasJBL}
                onChange={(e) => setFormData({ ...formData, hasJBL: e.target.checked })}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="hasJBL" className="text-gray-900">
                У меня есть колонка JBL с Party Connect
              </label>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-900 mb-2 font-medium">
                Выберите вариант:
              </label>
              <div className="space-y-2">
                {formData.name && formData.email ? (
                  <>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleSubmit('common')}
                        disabled={isSubmitting}
                        className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                      >
                        Ебашу общий алкоголь
                      </button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleSubmit('own')}
                        disabled={isSubmitting}
                        className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                      >
                        Пью свой алкоголь
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 italic">Сначала заполните имя и email</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm; 