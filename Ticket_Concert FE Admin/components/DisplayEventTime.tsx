import React from "react";

interface DisplayEventTimeProps {
  start: string | Date;
  end: string | Date;
}

const DisplayEventTime: React.FC<DisplayEventTimeProps> = ({ start, end }) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const isSameDate =
    startDate.getDate() === endDate.getDate() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear();

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDate = (date: Date) =>
    date.toLocaleDateString("vi-VN");

  return (
    <>
      {isSameDate ? (
        <>
          {formatTime(startDate)} - {formatTime(endDate)}, {formatDate(startDate)}
        </>
      ) : (
        <>
          {formatTime(startDate)}, {formatDate(startDate)} - {formatTime(endDate)}, {formatDate(endDate)}
        </>
      )}
    </>
  );
};

export default DisplayEventTime;
