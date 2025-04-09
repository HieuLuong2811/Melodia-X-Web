"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import Slider nhưng tắt SSR
const Slider = dynamic(() => import("react-slick"), { ssr: false });

const EventPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
          

  const slides = [
    { img: "TieuDe_3.jpg", video: "https://salt.tkbcdn.com/ts/ds/94/db/bd/e8d16ddb92f6da62316b231fb9718d6c.mp4" },
    { img: "TieuDe_4.jpg", video: "7311f4021007cf0a3dd0c45204449ad0.mp4" },
    { img: "TieuDe_5.jpg", video: "https://salt.tkbcdn.com/ts/ds/94/db/bd/e8d16ddb92f6da62316b231fb9718d6c.mp4" },
    { img: "TieuDe_6.jpg", video: "https://salt.tkbcdn.com/ts/ds/94/db/bd/e8d16ddb92f6da62316b231fb9718d6c.mp4" },
  ];

  if (!mounted) return null; // Chỉ render sau khi mounted

  return (
    <>
    {/* Bootstrap & Flag Icon CSS CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
      />
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"
      />
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/flag-icon-css/css/flag-icon.min.css"
      />
    <div className="container p-0">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="slide-item">
            <img src={slide.img} alt={`Event ${index}`} />
            {slide.video && (
              <video autoPlay muted loop playsInline>
                <source src={slide.video} type="video/mp4" />
              </video>
            )}
            <div className="content">
              <div className="info">
                <a href="#">
                  <button className="btn btn-border">Xem chi tiết</button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
    </>
  );
};

export default EventPage;
