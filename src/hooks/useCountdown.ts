import { useState, useEffect } from 'react';

interface CountdownState {
  hours: string;
  minutes: string;
  seconds: string;
}

const useCountdown = (): CountdownState => {
  const [countdown, setCountdown] = useState<CountdownState>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    // Get endTime from localStorage or set default (5 hours from now)
    const savedEndTime = localStorage.getItem('specialOfferEndTime');
    const endTime = savedEndTime 
      ? parseInt(savedEndTime, 10) 
      : Date.now() + 5 * 60 * 60 * 1000;
    
    // Save endTime to localStorage if not already set
    if (!savedEndTime) {
      localStorage.setItem('specialOfferEndTime', endTime.toString());
    }

    const calculateTimeLeft = () => {
      const difference = endTime - Date.now();
      
      if (difference <= 0) {
        // Reset when countdown ends
        localStorage.removeItem('specialOfferEndTime');
        const newEndTime = Date.now() + 5 * 60 * 60 * 1000;
        localStorage.setItem('specialOfferEndTime', newEndTime.toString());
        return {
          hours: '05',
          minutes: '00',
          seconds: '00'
        };
      }
      
      // Calculate remaining time
      let hours: number = Math.floor(difference / (1000 * 60 * 60));
      let minutes: number = Math.floor((difference / 1000 / 60) % 60);
      let seconds: number = Math.floor((difference / 1000) % 60);
      
      // Format with leading zeros
      return {
        hours: hours < 10 ? `0${hours}` : hours.toString(),
        minutes: minutes < 10 ? `0${minutes}` : minutes.toString(),
        seconds: seconds < 10 ? `0${seconds}` : seconds.toString()
      };
    };

    // Initial calculation
    setCountdown(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return countdown;
};

export default useCountdown;