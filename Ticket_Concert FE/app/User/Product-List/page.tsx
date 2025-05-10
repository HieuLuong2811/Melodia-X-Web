"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Menu from "@/components/Menu";
import Link from "next/link";
import EmptyData from "@/components/emptydata.tsx";
import dynamic from "next/dynamic";
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
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
          rel="stylesheet"
        />
      </Head>
      <div style={{ backgroundColor: "#1a1a1a", color: "#fff", zoom: 0.9 }}>
        <Nav />
        <Menu/>
        <div className="container position-relative pt-3" style={{minHeight : "1000px"}}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <TextField
                  label="Tìm kiếm"
                  variant="outlined"
                  fullWidth
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button variant="outlined" color="inherit">
                      Tải lại
                    </Button>
                    {/* Bộ lọc vị trí */}
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={handleLocationClick}
                      sx={{ textTransform: "none" }}
                    >
                    {filterLocation}
                    </Button>
                    <Popover
                      open={locationOpen}
                      anchorEl={locationAnchorEl}
                      onClose={handleLocationClose}
                      anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                      }}
                      PaperProps={{
                          sx: { backgroundColor: "#1a1a1a", color: "#fff", minWidth: "200px" },
                      }}
                    >
                    <List>
                        {locations.map((loc) => (
                        <ListItem
                            key={loc}
                            onClick={() => handleLocationSelect(loc)}
                            sx={{
                            "&:hover": { backgroundColor: "#333" },
                            backgroundColor: filterLocation === loc ? "#007bff" : "transparent",
                            color: filterLocation === loc ? "#fff" : "#fff",
                            }}
                        >
                            <ListItemText primary={loc} />
                        </ListItem>
                        ))}
                    </List>
                    </Popover>
                    {/* Bộ lọc ngày */}
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={handleDateClick}
                      sx={{ textTransform: "none" }}
                    >
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
                      PaperProps={{
                          sx: { backgroundColor: "#1a1a1a", color: "#fff", minWidth: "200px" },
                      }}
                    >
                    <List>
                        <ListItem
                        onClick={() => handleDateSelect("Tất cả các ngày")}
                        sx={{
                            "&:hover": { backgroundColor: "#333" },
                            backgroundColor: filterDate === "Tất cả các ngày" ? "#007bff" : "transparent",
                            color: filterDate === "Tất cả các ngày" ? "#fff" : "#fff",
                        }}
                        >
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
                            }}
                        >
                            <ListItemText primary={day.toLocaleDateString("vi-VN")} />
                        </ListItem>
                        ))}
                    </List>
                    </Popover>
                </Box>
            </Box>
            <Box>
                {filteredEvents.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap : 1}}>
                    {filteredEvents.map((suKien) => (
                    <Box key={suKien.IDSuKien} sx={{ p: 1, flex: "0 0 calc(25% - 8px)" }}>
                        <Link href={`/User/Product-Details/?id_detail=${suKien.IDSuKien}`} style={{ textDecoration: "none", color: "#fff" }}>
                        <Box sx={{ borderRadius: 2, overflow: "hidden", backgroundColor: "transparent"}}>
                            <img src={suKien.AnhNen}
                            alt={suKien.TenSuKien}
                            style={{ width: "100%", height: "200px", objectFit: "cover" }}
                            />
                            <Box sx={{ p: 1.5 }}>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: "bold", fontSize: "1.25rem", height: "45px", overflow: "hidden" }}
                            >
                                {suKien.TenSuKien}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ fontWeight: "bold", mb: 0.5, fontSize: "1.0625rem" }}
                            >
                                Từ {suKien.GiaVeReNhat ? Number(suKien.GiaVeReNhat).toLocaleString() + "đ" : "Đang cập nhật"}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#bbb", mb: 0 }}>
                                <i className="bi bi-calendar-event" style={{ marginRight: "0.5rem" }} />
                                <OnlyDate date={suKien.NgayDienDauTien} />
                            </Typography>
                            </Box>
                        </Box>
                        </Link>
                    </Box>
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