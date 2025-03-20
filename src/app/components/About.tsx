const About = () => {
  const features = [
    {
      title: 'Отличная музыка',
      description: 'Профессиональный DJ и качественное звуковое оборудование'
    },
    {
      title: 'Уникальная атмосфера',
      description: 'Стильное оформление и особая концепция вечеринки'
    },
    {
      title: 'Угощения и напитки',
      description: 'Разнообразный фуршет и авторские коктейли'
    },
    {
      title: 'Развлечения',
      description: 'Интерактивные зоны и увлекательная программа'
    }
  ];

  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">О вечеринке</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-purple-50 p-6 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-purple-600 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Мы стремимся создать незабываемое событие, которое останется в памяти каждого гостя.
            Ваша поддержка поможет нам сделать эту вечеринку действительно особенной!
          </p>
        </div>
      </div>
    </section>
  );
};

export default About; 