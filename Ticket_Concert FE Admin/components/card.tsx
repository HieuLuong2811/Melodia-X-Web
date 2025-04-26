import React, { ReactNode } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`card shadow rounded-4 mb-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`card-body p-4 ${className}`}>
      {children}
    </div>
  );
};
