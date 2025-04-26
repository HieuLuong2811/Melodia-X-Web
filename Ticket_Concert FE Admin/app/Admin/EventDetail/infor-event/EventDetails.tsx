import React from "react";

interface EventDetailsProps {
  htmlContent: string; 
}

const EventDetails: React.FC<EventDetailsProps> = ({ htmlContent }) => {
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default EventDetails;
