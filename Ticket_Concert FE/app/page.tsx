"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Menu from "../components/Menu.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { suKienService } from "../services/SuKien";
import { SuKien } from "../interfaces/SuKien";
import Link from "next/link";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Footer = dynamic(() => import('@/components/Footer.jsx'), { ssr: false });
const Nav = dynamic(() => import('@/components/Navbar.jsx'), { ssr: false });

const Slider = dynamic(() => import("react-slick"), { ssr: false });

export default function Home() {
  const [mounted, setMounted] = useState(false);

  const [suKiens, setSuKiens] = useState<SuKien[]>([]);

   useEffect(() => {
          const fetchSuKiens = async () => {
          const data = await suKienService.getAllSuKiens();
          setSuKiens(data);
          };
          
          fetchSuKiens();
      }, []);
  
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const baseSettings = {
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    dots: true,
  };
  
  const settings = { ...baseSettings, slidesToShow: 2 };
  const settings2 = { ...baseSettings, slidesToShow: 5 };
  const settings3 = { ...baseSettings, slidesToShow: 4 };
  

  const slides = [
    { img: "TieuDe_3.jpg", video: "https://salt.tkbcdn.com/ts/ds/94/db/bd/e8d16ddb92f6da62316b231fb9718d6c.mp4" },
    { img: "TieuDe_4.jpg", video: "https://salt.tkbcdn.com/ts/ds/94/db/bd/e8d16ddb92f6da62316b231fb9718d6c.mp4" },
    { img: "TieuDe_5.jpg", video: "https://salt.tkbcdn.com/ts/ds/94/db/bd/e8d16ddb92f6da62316b231fb9718d6c.mp4" },
    { img: "TieuDe_6.jpg", video: "https://salt.tkbcdn.com/ts/ds/94/db/bd/e8d16ddb92f6da62316b231fb9718d6c.mp4" },
  ];

  if (!mounted) return null; 

  const specialEvents = [
    { id: 1, title: "Vàng Ơi Là Vàng!", image: "https://ticketbox.vn/_next/image?url=https%3A%2F%2Fimages.tkbcdn.com%2F2%2F360%2F479%2Fts%2Fds%2F45%2Fbc%2Fc7%2Ff5fa05b6963c6f3f7ba0908540c369d0.jpg&w=640&q=75" },
    { id: 2, title: "The Next Icon", image: "https://ticketbox.vn/_next/image?url=https%3A%2F%2Fimages.tkbcdn.com%2F2%2F360%2F479%2Fts%2Fds%2F4e%2F93%2F30%2F6f3c83ffbc74baa67e18a2ef0ecf63e8.jpg&w=640&q=75" },
    { id: 3, title: "Fancine Liên Bỉnh Phát", image: "https://ticketbox.vn/_next/image?url=https%3A%2F%2Fimages.tkbcdn.com%2F2%2F360%2F479%2Fts%2Fds%2Fcc%2F41%2Feb%2Fc78ae0e04222c1ab3e726eafe08232c2.jpg&w=640&q=75" },
    { id: 4, title: "Những Kẻ Mộng Mơ", image: "https://ticketbox.vn/_next/image?url=https%3A%2F%2Fimages.tkbcdn.com%2F2%2F360%2F479%2Fts%2Fds%2F2a%2F9e%2F57%2Fbeb7172537b8cdccf0dfe263a6e8946b.jpg&w=640&q=75" },
    { id: 5, title: "Giai Điệu Hoàng Hôn", image: "https://ticketbox.vn/_next/image?url=https%3A%2F%2Fimages.tkbcdn.com%2F2%2F360%2F479%2Fts%2Fds%2Fb3%2Fcc%2F0e%2F47812e3a22b4c9874a1847f580b22a89.jpg&w=640&q=75" },
  ];
  
  return (
    <>
      <div style={{zoom : "0.9"}}>
        <Nav />
        <Menu />
        <main className="flex-1 pb-5 flex flex-col gap-8 row-start-2 items-center sm:items-start pt-4" style={{ backgroundColor: "#27272A" }}>
          <div className=" container p-0 d-flex flex-column gap-4">
            <div className="Video">
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
                        <Link href="/User/Product-Details">
                          <button className="btn btn-border">Xem chi tiết</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
            
            {/* Sự kiện đặc biệt */}
            <div className="Dac-biet event">
              <h5 className="text-light fw-bold ps-2">Sự kiện đặc biệt</h5>
              <Slider {...settings2}>
                {specialEvents.map((event) => (
                  <div key={event.id} className="rounded p-2  cursor-pointer">
                    <img  src={event.image}  alt={event.title}  className="img-fluid rounded-3 " />
                  </div>
                ))}
              </Slider>
            </div>

            {/* Sự kiện xu hướng */}
            <div className="Xu-huong event  mt-2">
              <h5 className="fw-bold text-light ps-2">🔥 Sự kiện xu hướng</h5>
              <div>
                  {suKiens.length > 0 ? (
                    <Slider {...settings3}>
                      {suKiens.map((suKien) => (
                        <div key={suKien.IDSuKien} className="p-2">
                          <Link className="text-decoration-none" href="/User/Product-Details/"
                          onClick={() => {localStorage.setItem("IDSuKien_User_Detail", suKien.IDSuKien)}}>
                            <div className="card text-white border-0 rounded-3 overflow-hidden bg-transparent">
                              <img className="card-img" src={suKien.AnhNen} style={{ height: "200px", objectFit: "cover" }}/>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <div className="text-center text-white">Không có sự kiện xu hướng</div>
                  )}
              </div>
            </div>
            

            {/* Dành cho bạn */}
            <div className="For-you event mt-2">
              <h5 className="fw-bold text-light ps-2">Dành cho bạn</h5>
              <div>
                  {suKiens.length > 0 ? (
                    <Slider {...settings3}>
                      {suKiens.map((suKien) => (
                        <div key={suKien.IDSuKien} className="p-2">
                          <Link className="text-decoration-none" href="/User/Product-Details/"
                          onClick={() => {localStorage.setItem("IDSuKien_User_Detail", suKien.IDSuKien)}}>
                            <div className="card text-white border-0 rounded-3 overflow-hidden bg-transparent">
                              <img className="card-img" src={suKien.AnhNen} style={{ height: "200px", objectFit: "cover" }}/>
                              <div className="card-body p-0 pt-3">
                                <h6 className="card-title fw-bold fs-5" style={{height : "45px"}}>{suKien.TenSuKien}</h6>
                                <p className="text t fw-bold mb-1" style={{fontSize : "17px"}}>
                                  {/* Từ {suKien.GiaVe.toLocaleString()}đ */}
                                  Từ 279.000 đ
                                </p>
                                <p className="text-secondary mb-0 text-white">
                                  <i className="bi bi-calendar-event me-2"></i> 
                                  {/* {suKien.NgayDienRa} */}
                                  30 tháng 04, 2025
                                </p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <div className="text-center text-white">Không có sự kiện xu hướng</div>
                  )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
