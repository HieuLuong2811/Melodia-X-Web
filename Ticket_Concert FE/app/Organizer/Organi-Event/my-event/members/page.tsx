'use client';
import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import './style.css';
import "../../../style/Home.css"
const LeftSidebar = dynamic(() => import('../component/menu'), { ssr: false });
const TopSidebar = dynamic(() => import('@/components/topSide-Organizer'), { ssr: false });
import { ThanhVien } from "@/interfaces/ThanhVien";
import { ThanhVienService } from '@/services/ThanhVien';
import Swal from 'sweetalert2';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

export default function MembersPage() {
  const [showModal, setShowModal] = useState(false);
  const [member, setMember] = useState<ThanhVien[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const IDSuKien = localStorage.getItem("IDSuKien_Organizer_Detail");
    if (IDSuKien) {
      ThanhVienService.GetThanhVienByID(IDSuKien).then((data) => {
        if (data) {
          const result = Array.isArray(data) ? data : [data];
          setMember(result);
        }
      });
    }
  }, []);

  const [editingMember, setEditingMember] = useState<ThanhVien | null>(null);
  const [formData, setFormData] = useState<Partial<ThanhVien>>({
    TenThanhVien: "",
    Email: "",
    VaiTro: ""
  });

  const handleEditMember = (member: ThanhVien) => {
    setEditingMember(member);
    setFormData(member);
    setShowModal(true);
  };

  const filteredMembers = useMemo(() => {
    return member.filter(member => 
      member.TenThanhVien.toLowerCase().includes(search.toLowerCase()) ||
      member.Email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, member]);

  const handleSaveMember = async () => {
    const IDSuKien = localStorage.getItem("IDSuKien_Organizer_Detail");
    if (!IDSuKien) return;
  
    if (!formData.TenThanhVien || !formData.Email || !formData.VaiTro) {
      Swal.fire("Lỗi!", "Vui lòng điền đầy đủ thông tin thành viên.", "warning");
      return;
    }
  
    const isEmailDuplicate = member.some(m => m.Email.toLowerCase() === formData.Email?.toLowerCase() && m.IDThanhVien !== editingMember?.IDThanhVien);
    if (isEmailDuplicate) {
      Swal.fire("Lỗi!", "Email này đã tồn tại.", "warning");
      return;
    }
  
    try {
      if (editingMember) {
        await ThanhVienService.UpdateThanhVien(editingMember.IDThanhVien, formData);
      } else {
        await ThanhVienService.CreateThanhVien({ ...formData, IDSuKien } as ThanhVien);
      }
      Swal.fire("Thành công!", `${editingMember ? "Đã cập nhật" : "Đã thêm"} thành viên.`, "success");
      setFormData({ TenThanhVien: "", Email: "", VaiTro: "" });
      setShowModal(false);
      const updated = await ThanhVienService.GetThanhVienByID(IDSuKien);
      setMember(updated);
      setEditingMember(null);
    } catch {
      Swal.fire("Lỗi!", `Có lỗi xảy ra khi ${editingMember ? "cập nhật" : "thêm"} thành viên.`, "error");
      setShowModal(false);
    }
  };

  const handleDeleteMember = (member: ThanhVien) => {
    Swal.fire({
      title: "Xác nhận xoá?",
      text: "Bạn có chắc chắn muốn xoá thành viên này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await ThanhVienService.DeleteThanhVien(member.IDThanhVien);
        const updated = await ThanhVienService.GetThanhVienByID(localStorage.getItem("IDSuKien_Organizer_Detail") || "");
        setMember(updated);
        Swal.fire("Đã xoá!", "Thành viên đã được xoá.", "success");
      }
    });
  };

  return (
    <>
      <div className='d-flex'>
        <LeftSidebar />
        <div id="right" className="overflow-auto w-100">
          <TopSidebar title="Quản lý thành viên" />
          <div className="container m-0 p-3" style={{ height: "100dvh", background: "linear-gradient(rgb(11, 43, 26), rgb(37 15 33))" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <TextField className='col-md-8 bg-white rounded' label="Nhập tên hoặc email" value={search} onChange={e => setSearch(e.target.value)} />
              <Button className='col-md-3 d-flex gap-2' onClick={() => setShowModal(true)} style={{ height: "40px" }} variant="contained">
                <i className="bi fs-4 bi-plus-circle"></i>Thêm thành viên
              </Button>
            </div>

            <div className='bg-white p-3 rounded'>
              {filteredMembers.length > 0 ? (
                <table className="table table-bordered ant-table-content">
                  <thead className="table-light">
                    <tr>
                      <th>Thành viên</th>
                      <th>Email</th>
                      <th>Vai trò</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member, index) => (
                      <tr key={index}>
                        <td>{member.TenThanhVien}</td>
                        <td>{member.Email}</td>
                        <td>{member.VaiTro}</td>
                        <td className='d-flex gap-3 justify-content-center'>
                          <Button className='col-md-2 d-flex gap-2' size="small" variant="outlined" onClick={() => handleEditMember(member)}>
                            <i className="bi bi-pencil-square"></i>Sửa
                          </Button>
                          <Button className='col-md-2 d-flex gap-2' size="small" variant="outlined" color="error" onClick={() => handleDeleteMember(member)}>
                            <i className="bi bi-trash"></i>Xoá
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div>Chưa có nhân viên nào</div>
              )}
            </div>

            {/* Modal using Bootstrap */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title text-dark">{editingMember ? "Sửa thành viên" : "Thêm thành viên"}</h5>
                    <button type="button" className="btn-close bg-dark text-light rounded-2" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body text-dark d-flex flex-column gap-3">
                    <div>
                      <label className='mb-2'>Tên thành viên</label>
                      <TextField label="Tên thành viên" fullWidth 
                      value={formData.TenThanhVien || ""}
                      onChange={(e) => setFormData({ ...formData, TenThanhVien: e.target.value })} />
                    </div>
                    <div>
                      <label className='mb-2'>Email</label>
                      <TextField label="Email" type="email" value={formData.Email || ""} fullWidth 
                      onChange={(e) => setFormData({ ...formData, Email: e.target.value })} />
                    </div>
                   <div>
                      <label className='mb-2'>Vai trò</label>
                      <FormControl fullWidth >
                      <InputLabel>Vai trò</InputLabel>
                      <Select value={formData.VaiTro || ""} label="Vai trò"
                        onChange={(e) => setFormData({ ...formData, VaiTro: e.target.value })}>
                        <MenuItem value="Chủ sự kiện">Chủ sự kiện</MenuItem>
                        <MenuItem value="Quản trị viên">Quản trị viên</MenuItem>
                        <MenuItem value="Quản lý">Quản lý</MenuItem>
                        <MenuItem value="Nhân viên (Check in)">Nhân viên (Check in)</MenuItem>
                        <MenuItem value="Nhân viên (Check out)">Nhân viên (Check out)</MenuItem>
                        <MenuItem value="Nhân viên (Redeem)">Nhân viên (Redeem)</MenuItem>
                      </Select>
                    </FormControl>
                   </div>
                    
                    <img src="/z6522280908633_3340a0fd7341189b05acb84a416eb68a.jpg" alt="Phân quyền chức năng" className="img-fluid rounded border" style={{ width: '1000px' }} />
                  </div>
                  <div className="modal-footer">
                    <Button onClick={handleSaveMember} color="primary" variant="contained">
                      Lưu
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
