"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Menu from "../components/Menu.tsx";
import { suKienService } from "../services/SuKien";
import { SuKien, SuKienNormal } from "../interfaces/SuKien";
import {OnlyDate} from "@/components/DisplayEventTime";
import Link from "next/link";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Footer = dynamic(() => import('@/components/Footer.jsx'), { ssr: false });
const Nav = dynamic(() => import('@/components/Navbar.jsx'), { ssr: false });

const Slider = dynamic(() => import("react-slick"), { ssr: false });

export default function Home() {

  const [activeTab, setActiveTab] = useState("weekend");
  
  const [mounted, setMounted] = useState(false);

  // Sự kiện tiêu đề
  const [titleEvent, settitleEvent] = useState<SuKien[]>([]);

  useEffect(() => {
    const fetchevent = async () => {
      const data = await suKienService.getTitleEvent();
      
      settitleEvent(data);
    }
    fetchevent();
  }, []);

  // const [time, setTime] = useState(0); 
  // useEffect(() => {

  //   const interval = setInterval(() => {
  //     setTime((prevTime) => prevTime + 1); 
  //   }, 1000);

  //   return () => clearInterval(interval); 
  // }, []);

  // useEffect(() => {

  //   if (time > 15) {
  //     console.log("Time:", time);
  //   } else {
  //     console.log("Nhỏ");
  //   }
    
  // }, [time]);

  // Sự kiện đặc biệt 
  const [specialEvents, setSpecialEvent] = useState<SuKien[]>([]);

  useEffect(() => {
    const fetchevent = async () => {
      const data = await suKienService.getSuKienTongVeBan();
      
      setSpecialEvent(data);
    }
    fetchevent();
  }, []);

   // Sự kiện xu hướng 
   const [trendingEvents, settrendingEvents] = useState<SuKien[]>([]);

   useEffect(() => {
     const fetchevent = async () => {
       const data = await suKienService.getSuKienGanNhatMua();
       
       settrendingEvents(data);
     }
     fetchevent();
   }, []);

  // Sự kiện bình thường
  const [weekendEvents, setWeekendEvents] = useState<SuKienNormal[]>([]);
  const [endOfMonthEvents, setEndOfMonthEvents] = useState<SuKienNormal[]>([]);

  const isWeekend = (date: Date) => {
    const day = date.getDay(); 
    return day === 0 || day === 6;
  };
  
  const isEndOfMonth = (date: Date) => {
    const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return date.getDate() === lastDate.getDate();
  };

  const [suKiens, setSuKiens] = useState<SuKienNormal[]>([]);

   useEffect(() => {
          const fetchSuKiens = async () => {
            const data = await suKienService.getAllSuKiens();
            setSuKiens(data);

            const weekend = data.filter((data) =>
              isWeekend(new Date(data.NgayDienDauTien))
            );
            const endMonth = data.filter((data) =>
              isEndOfMonth(new Date(data.NgayDienDauTien))
            );
        
            setWeekendEvents(weekend);
            setEndOfMonthEvents(endMonth);
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

  const tab = [
    { id: "weekend", label: "Cuối tuần này", Children : {weekendEvents}},
    { id: "month", label: "Cuối tháng này", Children : {endOfMonthEvents}}
  ];
  
  const settings = { ...baseSettings, slidesToShow: 1 };
  const settings2 = { ...baseSettings, slidesToShow: 5 };
  const settings3 = { ...baseSettings, slidesToShow: 4 };
  
  const crewData = [
    { name: "Tp.Hồ Chí Minh", image: "/crew1.jpg" },
    { name: "Hà Nội", image: "/crew2.jpg" },
    { name: "Đà Lạt", image: "/crew3.jpg" },
    { name: "Vị trí khác", image: "/crew4.jpg" },
  ];
  
    const settings4 = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };

  if (!mounted) return null; 

  return (
    <>
      <div style={{zoom : "0.9"}}>
        <Nav />
        <Menu />
        <main className="flex-1 flex flex-col row-start-2 items-center sm:items-start" style={{ backgroundColor: "#27272A" }}>
          <div className="hero-section d-flex align-items-center"
            style={{ backgroundImage: "url(/anhnen.jpg)", backgroundSize: "cover",
              backgroundPosition: "center",
              height: "640px",
              position: "relative",
            }}>
            <div className="container position-relative z-1 text-white">
              <div className="d-flex justify-content-between">
                <div className="col-md-5">
                  <p className="text-uppercase fw-light mb-2">Sự kiện ca nhạc</p>
                  <h1 className="display-3 fw-bold">Festival</h1>
                  <h2 className="display-6 fw-light mb-4">Music</h2>
                  <p className="mb-4">
                    Website quản lý sự kiện ca nhạc giúp người dùng dễ dàng tạo sự kiện, quản lý suất diễn và các loại vé. Đây là công cụ hiệu quả cho ban tổ chức trong việc theo dõi thông tin sự kiện và bán vé đến khán giả một cách chuyên nghiệp.
                  </p>

                  <a href="#event" className="btn btn-outline-light btn-lg">
                    Mua vé ngay
                    <i className="fas fa-arrow-right ms-2"></i>
                  </a>
                </div>
                <div className="Video col-md-6" style={{}}>
                  <Slider {...settings}>
                    {titleEvent.map((event) => (
                      <div key={event.IDSuKien} className="slide-item p-0">
                        <img src={event.AnhNen} alt={`Event ${event.IDSuKien}`} />
                        {event.Video && (
                          <video autoPlay muted loop playsInline>
                            <source src={event.Video} type="video/mp4" />
                          </video>
                        )}
                        <div className="content">
                          <div className="info">
                            <Link href= {`/User/Product-Details/?id_detail=${event.IDSuKien}`}>
                              <button className="btn btn-border">Xem chi tiết</button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </div>
          </div>
          <div id="event" className="container pt-4 pb-4 p-0 d-flex flex-column gap-5">            
            {/* Sự kiện đặc biệt */}
            <div className="Dac-biet event">
              <h5 className="text-light fw-bold ps-2">Sự kiện đặc biệt</h5>
              <Slider {...settings2}>
                {specialEvents.map((event) => (
                  <div key={event.IDSuKien} className="rounded p-2 cursor-pointer">
                    <Link href= {`/User/Product-Details/?id_detail=${event.IDSuKien}`}>
                      <img  src={event.Logo}  alt={event.TenSuKien}  className="img-fluid rounded-3 " />
                    </Link>
                  </div>
                ))}
              </Slider>
            </div>

            {/* Sự kiện xu hướng */}
            <div className="Xu-huong event  mt-2">
              <h5 className="fw-bold text-light ps-2">🔥 Sự kiện xu hướng</h5>
              <div>
                  {trendingEvents.length > 0 ? (
                    <Slider {...settings3}>
                      {trendingEvents.map((suKien) => (
                        <div key={suKien.IDSuKien} className="p-2">
                          <Link className="text-decoration-none" href= {`/User/Product-Details/?id_detail=${suKien.IDSuKien}`}>
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
                          <Link className="text-decoration-none" href= {`/User/Product-Details/?id_detail=${suKien.IDSuKien}`}>
                            <div className="card text-white border-0 rounded-3 overflow-hidden bg-transparent">
                              <img className="card-img " src={suKien.AnhNen} style={{ height: "200px", objectFit: "cover" }}/>
                              <div className="card-body p-0 pt-3">
                                <h6 className="card-title fw-bold fs-5" style={{height : "50px", overflow : "hidden"}}>{suKien.TenSuKien}</h6>
                                <p className="text t fw-bold mb-1" style={{fontSize : "17px"}}>
                                  Từ {suKien.GiaVeReNhat? Number(suKien.GiaVeReNhat).toLocaleString() + "đ" : "Đang cập nhật"}
                                </p>
                                <p className="text-secondary mb-0 text-white">
                                  <i className="bi bi-calendar-event me-2"></i> 
                                  <OnlyDate date={suKien.NgayDienDauTien}/>
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

            <div className="For-you event mt-2">
              <ul className="nav ps-2 nav-tabs nav-line d-flex fs-4 nav-color-secondary p-0 border-0 align-items-center" role="tablist">
                {tab.map((tab) => (
                <li className="nav-item submenu" role="presentation" key={tab.id}>
                  <button className={`p-2 d-flex align-items-center fs-5 justify-content-center gap-2 fw-bold border-0 bg-transparent rounded-0 nav-link ${
                    activeTab === tab.id ? "active" : ""}`} style={{width : "200px"}} onClick={() => setActiveTab(tab.id)}>
                    {tab.label}
                  </button>
                </li>
                ))}
              </ul>
              <div className="tab-content text-white mt-3">
                {activeTab === "weekend" && (
                  <Slider {...settings3}>
                    {weekendEvents.map((event) => (
                      <div key={event.IDSuKien} className="p-2">
                        <Link className="text-decoration-none" href= {`/User/Product-Details/?id_detail=${event.IDSuKien}`}>
                          <div className="card text-white border-0 rounded-3 overflow-hidden bg-transparent">
                            <img className="card-img" src={event.AnhNen} style={{ height: "200px", objectFit: "cover" }} />
                            <div className="card-body p-0 pt-3">
                              <h6 className="card-title fw-bold fs-5" style={{ height: "50px",overflow : "hidden"}}>{event.TenSuKien}</h6>
                              <p className="text t fw-bold mb-1" style={{ fontSize: "17px" }}>
                                Từ {event.GiaVeReNhat ? Number(event.GiaVeReNhat).toLocaleString() + "đ" : "Đang cập nhật"}
                              </p>
                              <p className="text-secondary mb-0 text-white">
                                <i className="bi bi-calendar-event me-2"></i> 
                                <OnlyDate date={event.NgayDienDauTien} />
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </Slider>
                )}

                {activeTab === "month" && (
                  <Slider {...settings3}>
                    {endOfMonthEvents.map((event) => (
                      <div key={event.IDSuKien} className="p-2">
                        <Link className="text-decoration-none" href= {`/User/Product-Details/?id_detail=${event.IDSuKien}`}>
                          <div className="card text-white border-0 rounded-3 overflow-hidden bg-transparent">
                            <img className="card-img" src={event.AnhNen} style={{ height: "200px", objectFit: "cover" }} />
                            <div className="card-body p-0 pt-3">
                              <h6 className="card-title fw-bold fs-5" style={{ height: "50px",overflow : "hidden" }}>{event.TenSuKien}</h6>
                              <p className="text t fw-bold mb-1" style={{ fontSize: "17px" }}>
                                Từ {event.GiaVeReNhat ? Number(event.GiaVeReNhat).toLocaleString() + "đ" : "Đang cập nhật"}
                              </p>
                              <p className="text-secondary mb-0 text-white">
                                <i className="bi bi-calendar-event me-2"></i> 
                                <OnlyDate date={event.NgayDienDauTien} />
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </Slider>
                )}
              </div>
            </div>
          </div>
          <div className="py-5 px-3 bg-dark text-white">
            <div className="container">
              <div className="row align-items-center mb-4">
                <div className="col-md-5">
                  <h2 className="display-5 fw-bold text-success">Địa điểm nổi bật</h2>
                </div>
              </div>

              <Slider {...settings4}>
                {crewData.map((crew, index) => (
                  <div key={index} className="text-center px-2">
                    <div className="bg-light rounded overflow-hidden">
                      <Image
                        src={crew.image}
                        alt={crew.name}
                        width={500}
                        height={300}
                        className="img-fluid rounded"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <p className="mt-2 text-white">{crew.name}</p>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
