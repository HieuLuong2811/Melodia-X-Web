"use client" 
import React, {useState} from "react";
import { TextField, Button, Box,Checkbox, FormControlLabel  } from "@mui/material";
import "../../Authen/style.css";
const RegisterForm = () => {
    const [checked, setChecked] = useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };
    return (
      <Box component="form" className="bg-white p-4" sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 500, margin: 'auto', mt: 5 }}>
        <TextField label="Email" type="email" variant="outlined" fullWidth required />
        <TextField label="Mật khẩu"  type="password" variant="outlined" fullWidth required/>
        <div className="d-flex justify-content-between">
            <FormControlLabel
            control={<Checkbox checked={checked} onChange={handleChange} />}
            label="Ghi nhớ tài khoản"
            />
        </div>
        <FormControlLabel
        control={<Checkbox checked={checked} onChange={handleChange} />}
        label="Tôi đồng ý với điều khoản"
        />
        <Button type="submit" variant="contained" color="primary">
          Đăng nhập
        </Button>
      </Box>
    );
  };
  
  export default RegisterForm;