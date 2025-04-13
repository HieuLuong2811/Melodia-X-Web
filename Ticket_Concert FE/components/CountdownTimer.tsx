"use client";
import React, { useEffect, useState } from "react";

const CountdownTimer = ({ onTimeout }: { onTimeout: () => void }) => {
  const [countdown, setCountdown] = useState<number>(900); 

  useEffect(() => {
    let initialCountdown = 900;
    const storedCountdown = sessionStorage.getItem("countdownTime");

    if (storedCountdown) {
      initialCountdown = Number(storedCountdown);
    } else {
      sessionStorage.setItem("countdownTime", initialCountdown.toString());
    }

    setCountdown(initialCountdown);

    const timerInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timerInterval);
          onTimeout();
          sessionStorage.removeItem("countdownTime");
          return 0;
        }

        const updatedCountdown = prevCountdown - 1;
        sessionStorage.setItem("countdownTime", updatedCountdown.toString());
        return updatedCountdown;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [onTimeout]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="text-center pt-4 pb-4 border bg-white-transparen" style={{ borderRadius: "40px", background: "rgba(255, 255, 255, 0.5)" }}>
      <span className="fw-bold mb-2">Hoàn tất đặt vé trong</span>
      <div className="time text-white rounded mt-3 mb-2 fw-bold d-flex justify-content-center gap-2">
        <span className="p-3 fw-bold">{minutes.toString().padStart(2, "0")}</span>
        <p className="fs-2">꞉</p>
        <span className="p-3 fw-bold">{seconds.toString().padStart(2, "0")}</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
