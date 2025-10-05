import cron from 'node-cron';
import pool from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import ThongBaoModel from '../models/ThongBao.js';
import { sendNotificationToUser, sendNotificationToManyUsers } from '../models/notificationServiceSocket.js';

export const ThongBaoRealTime = () => {
    // cron.schedule('* * * * *', async () => {
    //     console.log("Running")
    //     const msg = {
    //         tieuDe: `Nhắc nhở sự kiện:`,
    //         noiDung: `Suất diễn của sự kiện sẽ bắt đầu lúc Đừng quên tham gia nhé!`,
    //         ngayTao: new Date(),
    //         trangThai: 'Chưa đọc'
    //     };
    //     const idThongBao = uuidv4();
    //     await ThongBaoModel.createThongBao(idThongBao, { idNguoiDung: '3671ca1e-0445-4aac-968f-9fb45cd86149', ...msg });
    //     sendNotificationToUser("3671ca1e-0445-4aac-968f-9fb45cd86149", { idThongBao, ...msg });
    // })
    cron.schedule('* 1 * * *', async () => {

        const [rows] = await pool.execute(`
            SELECT sk.IDSuKien, sd.IDSuatDien, sk.TenSuKien, sd.ThoiGianBatDau
            FROM SuatDien sd
            JOIN SuKien sk ON sk.IDSuKien = sd.IDSuKien
            WHERE sd.ThoiGianBatDau BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 1 HOUR)
        `);

        for (const suat of rows) {
            const msg = {
                tieuDe: `Nhắc nhở sự kiện: ${suat.TenSuKien}`,
                noiDung: `Suất diễn của sự kiện "${suat.TenSuKien}" sẽ bắt đầu lúc ${suat.ThoiGianBatDau}. Đừng quên tham gia nhé!`,
                ngayTao: new Date(),
                trangThai: 'Chưa đọc'
            };

            const [users] = await pool.execute(`
                SELECT DISTINCT hd.IDNguoiDung
                FROM HoaDonMuaVe hd
                JOIN ChiTietHoaDon cthd ON hd.IDHoaDon = cthd.IDHoaDon
                JOIN LoaiVe lv ON cthd.IDLoaiVe = lv.IDLoaiVe
                WHERE lv.IDSuatDien = ?
            `, [suat.IDSuatDien]);

            const userIds = users.map(u => u.IDNguoiDung);

            for (const uid of userIds) {
                const idThongBao = uuidv4();
                await ThongBaoModel.createThongBao(idThongBao, { idNguoiDung: uid, ...msg });
            }

            sendNotificationToManyUsers(userIds, msg);
        }
    });

    cron.schedule('30 * * * *', async () => {

        const [suatDiens] = await pool.execute(`
            SELECT sk.IDSuKien, sk.TenSuKien, sd.IDSuatDien, sd.ThoiGianBatDau, sd.ThoiGianKetThuc, sk.TrangThaiSuKien
            FROM SuatDien sd
            JOIN SuKien sk ON sk.IDSuKien = sd.IDSuKien
        `);

        for (const suat of suatDiens) {
            const now = new Date();
            const start = new Date(suat.ThoiGianBatDau);
            const end = new Date(suat.ThoiGianKetThuc);

            let newStatus = null;
            let message = null;

            if (now >= start && now < end && suat.TrangThaiSuKien !== 'Đang diễn ra') {
                newStatus = 'Đang diễn ra';
                message = `Sự kiện "${suat.TenSuKien}" đã bắt đầu!`;
            } else if (now >= end && suat.TrangThaiSuKien !== 'Hoàn thành') {
                newStatus = 'Hoàn thành';
                message = `Sự kiện "${suat.TenSuKien}" đã kết thúc. Cảm ơn bạn đã tham gia!`;
            } else if (now < start && suat.TrangThaiSuKien !== 'Chưa bắt đầu') {
                newStatus = 'Chưa bắt đầu';
            }

            if (newStatus) {
                await pool.execute(`UPDATE SuKien SET TrangThaiSuKien = ? WHERE IDSuKien = ?`, [newStatus, suat.IDSuKien]);

                if (message) {
                    const msg = {
                        tieuDe: "Cập nhật sự kiện",
                        noiDung: message,
                        ngayTao: new Date(),
                        trangThai: "Chưa đọc"
                    };

                    const [users] = await pool.execute(`
                        SELECT DISTINCT hd.IDNguoiDung
                        FROM HoaDonMuaVe hd
                        JOIN ChiTietHoaDon cthd ON hd.IDHoaDon = cthd.IDHoaDon
                        JOIN LoaiVe lv ON cthd.IDLoaiVe = lv.IDLoaiVe
                        WHERE lv.IDSuatDien = ?
                    `, [suat.IDSuatDien]);

                    const userIds = users.map(u => u.IDNguoiDung);

                    for (const uid of userIds) {
                        const idThongBao = uuidv4();
                        await ThongBaoModel.createThongBao(idThongBao, { idNguoiDung: uid, ...msg });
                    }

                    sendNotificationToManyUsers(userIds, msg);
                }

                console.log(`Cập nhật sự kiện ${suat.TenSuKien} → ${newStatus}`);
            }
        }
    });

    cron.schedule('*/10 * * * *', async () => {
        try {
            const [orders] = await pool.execute(`
                SELECT * 
                FROM HoaDonMuaVe 
                WHERE TrangThaiThanhToan = 'Chưa thanh toán' 
                AND TIMESTAMPDIFF(MINUTE, NgayThanhToan, NOW()) >= 10
            `);

            for (let order of orders) {
                await pool.execute(`DELETE FROM HoaDonMuaVe WHERE IDHoaDon = ?`, [order.IDHoaDon]);

                const msg = {
                    tieuDe: 'Hóa đơn đã bị hủy',
                    noiDung: `Hóa đơn mua vé của sự kiện #${order.TenSuKien} đã bị hủy do quá hạn 10 phút mà chưa thanh toán.`,
                    ngayTao: new Date(),
                    trangThai: 'Chưa đọc'
                };

                const idThongBao = uuidv4();
                await ThongBaoModel.createThongBao(idThongBao, { idNguoiDung: order.IDNguoiDung, ...msg });
                sendNotificationToUser(order.IDNguoiDung, { idThongBao, ...msg });
            }
        } catch (error) {
            console.error('Cron lỗi hủy hóa đơn:', error);
        }
    });
}



async function getNotificationsFromDB(userId) {
  return await ThongBaoModel.find({ IDNguoiDung: userId }).sort({ NgayTao: -1 }).lean();
}

async function saveNotificationToDB(userId, noti) {
  const created = new ThongBaoModel({
    IDNguoiDung: userId,
    ...noti,
  });
  return await created.save();
}
