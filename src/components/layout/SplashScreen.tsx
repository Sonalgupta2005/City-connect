import { useEffect, useState } from 'react';

export const SplashScreen = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gradient-bg text-white transition-opacity duration-500 ease-in-out">
      <div className="text-center animate-fade-in-up">
        <h1 className="text-5xl font-extrabold tracking-tight">CityConnect</h1>
        <p className="mt-2 text-lg opacity-90">The Smart way to move and save</p>
      </div>
    </div>
  );
};
