"use client";
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { styled } from "@mui/system";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Background = styled("div")({
  minHeight: "100vh",
  backgroundImage: 'url("/concert-bg.jpg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
});

const FormWrapper = styled(Paper)({
  maxWidth: 400,
  width: "100%",
  padding: "30px",
  borderRadius: "10px",
  background: "#FFF",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
});

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); 

  const handleRequestVerification = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/request-verification", {
        email,
        phone,
      });
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Mã xác thực đã được gửi",
          text: "Hãy kiểm tra email hoặc điện thoại của bạn.",
        });
        setStep(2); 
      }
    } catch (error) {
      console.error("Lỗi yêu cầu mã xác thực:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi gửi mã xác thực",
        text: "Đã có lỗi xảy ra khi gửi mã xác thực.",
      });
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/verify-code", {
        verificationCode,
        email,
        phone,
      });
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Mã xác thực thành công",
          text: "Vui lòng nhập mật khẩu mới.",
        });
        setStep(3); // Move to step 3 (reset password)
      } else {
        Swal.fire({
          icon: "error",
          title: "Mã xác thực không đúng",
          text: "Vui lòng kiểm tra lại mã xác thực.",
        });
      }
    } catch (error) {
      console.error("Lỗi xác thực mã:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi xác thực",
        text: "Đã có lỗi xảy ra khi xác thực mã.",
      });
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Mật khẩu không khớp",
        text: "Vui lòng kiểm tra lại mật khẩu.",
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/reset-password", {
        email,
        phone,
        password,
      });
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Mật khẩu đã được thay đổi",
          text: "Vui lòng đăng nhập với mật khẩu mới.",
        });
        setStep(1); // Back to step 1
      }
    } catch (error) {
      console.error("Lỗi thay đổi mật khẩu:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi thay đổi mật khẩu",
        text: "Đã có lỗi xảy ra khi thay đổi mật khẩu.",
      });
    }
  };

  return (
    <Background>
      <FormWrapper elevation={10} sx={{ padding: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "rgb(45, 194, 117)", padding: "16px" }}>
          <Typography variant="h5" color="#FFF" fontWeight="bold" align="center">
            🎵 MelodiaX.vn
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" p={4} gap={3}>
          {step === 1 && (
            <>
              <TextField
                label="Email hoặc Số điện thoại"
                fullWidth
                value={email || phone}
                onChange={(e) => {
                  if (e.target.value.includes("@")) {
                    setEmail(e.target.value);
                    setPhone("");
                  } else {
                    setPhone(e.target.value);
                    setEmail("");
                  }
                }}
              />
              <Button onClick={handleRequestVerification} variant="contained" color="primary" fullWidth>
                Gửi mã xác thực
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <TextField
                label="Mã xác thực"
                fullWidth
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <Button onClick={handleVerifyCode} variant="contained" color="primary" fullWidth>
                Xác thực mã
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <TextField
                label="Mật khẩu mới"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Nhập lại mật khẩu"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button onClick={handleResetPassword} variant="contained" color="primary" fullWidth>
                Thay đổi mật khẩu
              </Button>
            </>
          )}
        </Box>
      </FormWrapper>
    </Background>
  );
};

export default LoginForm;
