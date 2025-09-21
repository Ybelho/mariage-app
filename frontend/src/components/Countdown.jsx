"use client";
import { useEffect, useState } from "react";

const Countdown = ({ date }) => {
  const target = new Date(date).getTime();
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / 1000 / 60) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });

      if (distance < 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  if (target - new Date().getTime() <= 0)
    return <p className="text-2xl text-green-700">🎉 C'est le grand jour !</p>;

  return (
    <div className="flex justify-center gap-4 text-xl font-semibold text-pink-800">
      <div>{timeLeft.days} j</div>
      <div>{timeLeft.hours} h</div>
      <div>{timeLeft.minutes} min</div>
      <div>{timeLeft.seconds} s</div>
    </div>
  );
};

export default Countdown;

