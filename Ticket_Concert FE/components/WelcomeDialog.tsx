'use client';
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";

export default function WelcomeDialog() {
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="welcome-dialog-title"
      aria-describedby="welcome-dialog-description"
    >
      <Box sx={{ backgroundColor: "#FFF" }}>
        <DialogTitle id="welcome-dialog-title" sx={{ fontWeight: "bold" }}>
          LƯU Ý KHI ĐĂNG TẢI SỰ KIỆN!
        </DialogTitle>
        <DialogContent>
          <div className="ant-modal-body">
            <div>
              1. Vui lòng
              <b> không hiển thị thông tin liên lạc của Ban Tổ Chức</b> (ví dụ:
              Số điện thoại/ Email/ Website/ Facebook/ Instagram…)
              <b> trên banner và trong nội dung bài đăng.</b> Chỉ sử dụng duy
              nhất Hotline Ticketbox - 1900.6408.
              <br />
              2. Trong trường hợp Ban tổ chức{" "}
              <b>
                tạo mới hoặc cập nhật sự kiện không đúng theo quy định nêu trên,
                Ticketbox có quyền từ chối phê duyệt sự kiện.
              </b>
              <br />
              3. Ticketbox sẽ liên tục kiểm tra thông tin các sự kiện đang được
              hiển thị trên nền tảng,
              <b>
                {" "}
                nếu phát hiện có sai phạm liên quan đến hình ảnh/ nội dung bài
                đăng, Ticketbox có quyền gỡ bỏ hoặc từ chối cung cấp dịch vụ đối
                với các sự kiện này,
              </b>{" "}
              dựa theo điều khoản 2.9 trong Hợp đồng dịch vụ.
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
