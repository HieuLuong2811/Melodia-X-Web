import { getAllKhuVuc, getKhuVucById } from '../models/KhuVuc.js';

const KhuVucController = {
  getAllKhuVucCtrl: async (req, res) => {
    try {
      const khuVucs = await getAllKhuVuc();
      if (!khuVucs || khuVucs.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy khu vực nào" });
      }
      res.status(200).json(khuVucs);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khu vực:', error);
      res.status(500).json({ message: "Lỗi lấy danh sách khu vực", error: error.message });
    }
  },

  getKhuVucByIdCtrl: async (req, res) => {
    try {
      const khuVuc = await getKhuVucById(req.params.idKhuVuc);
      if (!khuVuc) {
        return res.status(404).json({ message: "Không tìm thấy khu vực nào" });
      }
      res.status(200).json(khuVuc);
    } catch (error) {
      console.error(`Lỗi khi lấy khu vực với ID ${req.params.idKhuVuc}:`, error);
      res.status(500).json({ message: "Lỗi lấy khu vực", error: error.message });
    }
  }
};

export default KhuVucController;