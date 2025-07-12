"use client";
import React, { useState, useEffect } from "react";
import Menu from "@/components/Menu";
import Link from "next/link";
import dynamic from 'next/dynamic';
const EmptyData = dynamic(() => import('@/components/emptydata'));
const Footer = dynamic(() => import('@/components/Footer.jsx'), { ssr: false });
const Nav = dynamic(() => import('@/components/Navbar.jsx'), { ssr: false });
import {suKienService} from "@/services/SuKien.ts";
import { SuKienNormal } from "@/interfaces/SuKien.ts";
import {
  Box,
  Typography,
  Button,
  Popover,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import TextField from '@mui/material/TextField';
const Home = () => {
  const [suKiens, setSuKiens] = useState<SuKienNormal[]>([]);
  const [filterLocation, setFilterLocation] = useState("Toàn quốc");
  const [filterDate, setFilterDate] = useState("Tất cả các ngày");

  // Popover state
  const [locationAnchorEl, setLocationAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [dateAnchorEl, setDateAnchorEl] = useState<HTMLButtonElement | null>(null);

  const locations = ["Toàn quốc", "Hồ Chí Minh", "Hà Nội", "Đà Lạt", "Vị trí khác"];

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await suKienService.getAllSuKiens();
      setSuKiens(data);
    }
    fetchEvents();
  }, []);

  // Tạo danh sách ngày trong tháng hiện tại
  const [currentMonth] = useState(new Date());
  const generateDays = () => {
    const days = [];
    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };
  const days = generateDays();

  // Lọc sự kiện theo vị trí và ngày
  const filteredEvents = suKiens.filter((suKien) => {
    // const matchesLocation = filterLocation === "Toàn quốc" || filter(filterLocation);
    const matchesDate = filterDate === "Tất cả các ngày" || suKien.NgayDienDauTien === filterDate;
    return matchesDate;
  });

  // Component con: Hiển thị ngày
  const OnlyDate = ({ date }: { date: string | number | Date }) => {
    return <span>{new Date(date).toLocaleDateString("vi-VN")}</span>;
  };

  // Xử lý Popover
  const handleLocationClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLocationAnchorEl(event.currentTarget);
  };

  const handleDateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDateAnchorEl(event.currentTarget);
  };

  const handleLocationClose = () => {
    setLocationAnchorEl(null);
  };

  const handleDateClose = () => {
    setDateAnchorEl(null);
  };

  const handleLocationSelect = (loc: string) => {
    setFilterLocation(loc);
    handleLocationClose();
  };

  const handleDateSelect = (date: string | number | Date) => {
    setFilterDate(typeof date === "string" ? date : new Date(date).toLocaleDateString("vi-VN"));
    handleDateClose();
  };

  const locationOpen = Boolean(locationAnchorEl);
  const dateOpen = Boolean(dateAnchorEl);

  return (
    <>
      <div style={{ backgroundColor: "#1a1a1a", color: "#fff", zoom: 0.9 }}>
        <Nav />
        <Menu/>
        <div className="container p-0 position-relative pt-3" style={{minHeight : "1000px"}}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <TextField label="Tìm kiếm" sx={{bgcolor : "white", color : "white", borderRadius : 2}} variant="outlined" fullWidth/>
                <Box sx={{ display: "flex", width : "50%", justifyContent : "end", alignItems: "center", gap: 1 }}>            
                    <Button variant="outlined" color="inherit" onClick={handleLocationClick} sx={{ textTransform: "none" }}>
                      {filterLocation}
                    </Button>
                    <Popover
                      open={locationOpen}
                      anchorEl={locationAnchorEl}
                      onClose={handleLocationClose}
                      anchorOrigin={{vertical: "bottom", horizontal: "left"}}
                      PaperProps={{sx: { backgroundColor: "#1a1a1a", color: "#fff", minWidth: "200px" }}}>
                    <List>
                        {locations.map((loc) => (
                        <ListItem
                            key={loc}
                            onClick={() => handleLocationSelect(loc)}
                            sx={{
                            "&:hover": { backgroundColor: "#333" },
                            backgroundColor: filterLocation === loc ? "#007bff" : "transparent",
                            color: filterLocation === loc ? "#fff" : "#fff" }}>
                            <ListItemText primary={loc} />
                        </ListItem>
                        ))}
                    </List>
                    </Popover>
                    
                    <Button variant="outlined" color="inherit" onClick={handleDateClick} sx={{ textTransform: "none" }}>                 
                      {filterDate}
                    </Button>

                    <Popover
                      open={dateOpen}
                      anchorEl={dateAnchorEl}
                      onClose={handleDateClose}
                      anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                      }}
                      PaperProps={{ sx: { backgroundColor: "#1a1a1a", color: "#fff", minWidth: "200px" }}}>
                    <List>
                        <ListItem
                        onClick={() => handleDateSelect("Tất cả các ngày")}
                        sx={{
                            "&:hover": { backgroundColor: "#333" },
                            backgroundColor: filterDate === "Tất cả các ngày" ? "#007bff" : "transparent",
                            color: filterDate === "Tất cả các ngày" ? "#fff" : "#fff",
                        }}>
                        <ListItemText primary="Tất cả các ngày" />
                        </ListItem>
                        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)", my: 0.5 }} />
                        {days.map((day) => (
                        <ListItem
                            key={day.toISOString()}
                            onClick={() => handleDateSelect(day)}
                            sx={{
                            "&:hover": { backgroundColor: "#333" },
                            backgroundColor: filterDate === day.toLocaleDateString("vi-VN") ? "#007bff" : "transparent",
                            color: filterDate === day.toLocaleDateString("vi-VN") ? "#fff" : "#fff",
                            }}>
                            <ListItemText primary={day.toLocaleDateString("vi-VN")} />
                        </ListItem>
                        ))}
                    </List>
                    </Popover>
                </Box>
            </Box>
            <Box>
                {filteredEvents.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap"}}>
                    {filteredEvents.map((suKien) => (
                     <div key={suKien.IDSuKien} className="p-2" style={{width : "350px"}}>
                          <Link className="text-decoration-none" href= {`/User/Event-Details/?id_detail=${suKien.IDSuKien}`}>
                            <div className="card text-white border-0 rounded-3 overflow-hidden bg-transparent">
                              <img className="card-img " src={suKien.AnhNen} style={{ height: "200px", objectFit: "cover" }}/>
                              <div className="card-body p-0 pt-3">
                                <h6 className="card-title fw-bold fs-5" style={{height : "50px", width : "340px", overflow : "hidden"}}>{suKien.TenSuKien}</h6>
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
                </Box>
                ) : (
                 <Box className="sc-ffc90067-7 sc-cd78c11b-1 fFJbAL ePwTxf text-center">
                    <EmptyData />
                    <Typography textAlign="center">Không có sự kiện nào</Typography>                    
                  </Box>
                )}
            </Box>
              
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;