import React from "react";

interface DisplayEventTimeProps {
  start: string | Date;
  end: string | Date;
}

interface onlydate {
  date : string | Date;
}

export const OnlyDate: React.FC<onlydate> = ({date}) => {
  const parsedDate = new Date(date);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

  return <>{formatDate(parsedDate)}</>;
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
