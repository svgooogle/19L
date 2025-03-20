import Header from './components/Header';
import Hero from './components/Hero';
import RegistrationForm from './components/RegistrationForm';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <RegistrationForm />
    </main>
  );
}
