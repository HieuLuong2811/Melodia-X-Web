'use client'
import React, { useState, useEffect } from 'react';
import { LoaisuKienService } from '@/services/LoaiSuKien';
import { LoaiSuKien } from '@/interfaces/LoaiSuKien';
import Swal from 'sweetalert2';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton,} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  onClose: () => void;
}

const LoaiSuKienManager: React.FC<Props> = ({ onClose }) => {
  const [dsLoai, setDsLoai] = useState<LoaiSuKien[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<LoaiSuKien | null>(null);
  const [tenLoai, setTenLoai] = useState('');
  const [idLoai, setIdLoai] = useState('');

  const loadData = async () => {
    const data = await LoaisuKienService.getAllLoaiSuKiens();
    setDsLoai(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditMode(false);
    setTenLoai('');
    setSelected(null);
    setOpenPopup(true);
  };

  const handleOpenEdit = (loai: LoaiSuKien) => {
    setEditMode(true);
    setSelected(loai);
    setTenLoai(loai.TenLoai);
    setIdLoai(loai.IDLoaiSuKien);
    setOpenPopup(true);
  };


  const handleSave = async () => {
    try {
      if (editMode || selected) {
        await LoaisuKienService.updateLoaiSuKien(idLoai, { TenLoai: tenLoai });
        Swal.fire('Thành công', 'Cập nhật thành công', 'success');
      } else {
        if(tenLoai != ""){
            await LoaisuKienService.createLoaiSuKien({ TenLoai: tenLoai });
            Swal.fire('Thành công', 'Thêm mới thành công', 'success');
        }
        else {
            Swal.fire('Lỗi', 'Hãy nhập đầy đủ thông tin', 'warning');
        }
      }
      setOpenPopup(false);
      loadData();
    } catch (error) {
      Swal.fire('Lỗi', 'Có lỗi xảy ra khi lưu' + error);
    }
  };

  const handleDelete = async (loai: LoaiSuKien) => {
    setIdLoai(loai.IDLoaiSuKien);
    const confirm = await Swal.fire({
      title: 'Xoá loại sự kiện?',
      text: `Bạn có chắc muốn xoá "${loai.TenLoai}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Hủy'
    });
    if (confirm.isConfirmed) {
      try {
        await LoaisuKienService.deleteLoaiSuKien(loai.IDLoaiSuKien);
        Swal.fire('Đã xoá!', 'Xoá thành công', 'success');
        loadData();
      } catch (error) {
        Swal.fire('Lỗi', 'Không thể xoá'+ error);
      }
    }
  };

  const filteredLoai = dsLoai.filter(loai =>
    loai.TenLoai.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg p-5 w-100 position-relative">
        <div className='d-flex justify-content-between mb-3 align-items-center'>
            <h4 className="text-xl font-semibold ">Quản lý loại sự kiện</h4>
            <IconButton className="absolute top-2 right-2" onClick={onClose}>
                <CloseIcon />
            </IconButton>
        </div>

      <div className="d-flex justify-content-between align-items-center items-center mb-3 gap-2">
        <TextField className='col-md-8' label="Tìm kiếm loại sự kiện" variant="outlined" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <Button className='col-md-3 d-flex gap-2' style={{height : "40px"}} variant="contained" onClick={handleOpenAdd}>
            <i className="bi fs-4 bi-plus-circle"></i>Thêm</Button>
      </div>

      <div className="overflow-auto max-h-[60vh]">
        <table className="table-auto w-full border">
            <thead className="bg-gray-100">
            <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Tên loại</th>
                <th className="border px-4 py-2 text-center">Hành động</th>
            </tr>
            </thead>
            <tbody>
            {filteredLoai.length > 0 ? filteredLoai.map(loai => (
                <tr key={loai.IDLoaiSuKien}>
                <td className="border px-4 py-2">{loai.IDLoaiSuKien}</td>
                <td className="border px-4 py-2">{loai.TenLoai}</td>
                <td className="border px-4 d-flex gap-2 py-2 text-center">
                  <Button className='col-md-3 d-flex gap-2' size="small" variant="outlined" onClick={() => handleOpenEdit(loai)}>
                      <i className="bi bi-pencil-square"></i>Sửa</Button>
                  <Button className='col-md-3 d-flex gap-2' size="small" variant="outlined" color="error" onClick={() => handleDelete(loai)}>
                      <i className="bi bi-trash"></i>Xoá</Button>
                </td>
                </tr>
            )) : (
                <tr>
                <td colSpan={3} className="text-center text-gray-500 py-4">Không có dữ liệu</td>
                </tr>
            )}
            </tbody>
        </table>
      </div>

      <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
        <DialogTitle>{editMode ? 'Chỉnh sửa loại sự kiện' : 'Thêm loại sự kiện'}</DialogTitle>
        <DialogContent className='pt-3'>
            <TextField label="Tên loại sự kiện" fullWidth value={tenLoai} onChange={e => setTenLoai(e.target.value)} />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenPopup(false)}>Hủy</Button>
            <Button variant="contained" onClick={handleSave}>{editMode ? 'Lưu' : 'Thêm'}</Button>
        </DialogActions>
      </Dialog>
  </div>
  );
};

export default LoaiSuKienManager;
