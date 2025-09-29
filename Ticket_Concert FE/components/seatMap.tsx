import React from 'react';
import { KhuVuc } from '../interfaces/KhuVuc';
import { KhuVucService } from '../services/KhuVuc';

interface SeatMapProps {
  onSelect: (id: string, tenKhuVuc: string) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ onSelect }) => {
  const [khuVucs, setKhuVucs] = React.useState<KhuVuc[]>([]);

  React.useEffect(() => {
    KhuVucService.getAllKhuVucs()
      .then(setKhuVucs)
      .catch(console.error);
  }, []);

  const getId = (loai: KhuVuc['LoaiKhuVuc']): [string | undefined, string | undefined] => {
    const kv = khuVucs.find(k => k.LoaiKhuVuc === loai);
    return [kv?.IDKhuVuc, kv?.TenKhuVuc];
  };

  const handleClick = (loai: KhuVuc['LoaiKhuVuc']) => {
    const [id, tenKhuVuc] = getId(loai);
    if (id && tenKhuVuc) {
      onSelect(id, tenKhuVuc);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <svg width={1500} height={500} viewBox="0 0 1200 500">
        {/* ===== STAGE ===== */}
        <rect x={260} y={5} width={480} height={80} rx={6} fill="#bdc3c7" />
        <rect x={475} y={70} width={50} height={100} fill="#bdc3c7" />
        <rect x={420} y={165} width={160} height={70} rx={6} fill="#bdc3c7" />
        <text x={500} y={60} fill="white" fontWeight="bold" fontSize={32} textAnchor="middle">
          STAGE
        </text>

        {/* ===== VIP 1, 2 ===== */}
        <path d="M350 120 H450 V150 H390 V190 H340 Z"
          fill="#c0392b" stroke="#fff" strokeWidth={2}
          onClick={() => handleClick("VIP1")} />
        <text x={375} y={145} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle">VIP 1</text>

        <path d="M650 120 H550 V150 H610 V190 H660 Z"
          fill="#c0392b" stroke="#fff" strokeWidth={2}
          onClick={() => handleClick("VIP2")} />
        <text x={620} y={145} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle">VIP 2</text>

        {/* ===== VIP 3, 4 ===== */}
        <path d="M340 195 H390 V250 H480 V280 H330 Z"
          fill="#95a5a6" stroke="#fff" strokeWidth={2}
          onClick={() => handleClick("VIP3")} />
        <text x={370} y={270} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle">VIP 3</text>

        <path d="M660 195 H610 V250 H520 V280 H670 Z"
          fill="#95a5a6" stroke="#fff" strokeWidth={2}
          onClick={() => handleClick("VIP4")} />
        <text x={630} y={270} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle">VIP 4</text>

        {/* VIP 5 */}
        <rect x={400} y={350} width={200} height={40} stroke="#fff" strokeWidth={2} fill="#bdc3c7"
          onClick={() => handleClick("VIP5")} />
        <text x={500} y={375} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle">VIP 5</text>

        {/* FOH */}
        <rect x={440} y={290} width={120} height={35} fill="#555" />
        <rect x={470} y={310} width={60} height={25} fill="#555" />
        <text x={500} y={315} fill="white" fontSize={22} fontWeight="bold" textAnchor="middle">FOH</text>

        {/* ===== A Blocks ===== */}
        <polygon points="250,120 340,120 330,190 240,190"
          fill="#f1c40f" stroke="#fff" strokeWidth={2} onClick={() => handleClick("A1")} />
        <text x={290} y={165} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle">A1</text>

        <polygon points="750,120 660,120 670,190 760,190"
          fill="#f1c40f" stroke="#fff" strokeWidth={1} onClick={() => handleClick("A2")} />
        <text x={710} y={165} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle">A2</text>

        <polygon points="240,195 330,195 320,280 230,280"
          fill="#f1c40f" stroke="#fff" strokeWidth={2} onClick={() => handleClick("A3")} />
        <text x={280} y={245} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle">A3</text>

        <polygon points="760,195 670,195 680,280 770,280"
          fill="#f1c40f" stroke="#fff" strokeWidth={2} onClick={() => handleClick("A4")} />
        <text x={720} y={245} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle">A4</text>

        {/* ===== B Blocks ===== */}
        <polygon points="150,135 240,120 230,190 140,190"
          fill="#7756ca" stroke="#fff" strokeWidth={2} onClick={() => handleClick("B1")} />
        <text x={195} y={165} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle">B1</text>

        <polygon points="850,135 760,120 770,190 860,190"
          fill="#7756ca" stroke="#fff" strokeWidth={2} onClick={() => handleClick("B2")} />
        <text x={810} y={165} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle">B2</text>

        <polygon points="140,195 230,195 220,280 125,280"
          fill="#7756ca" stroke="#fff" strokeWidth={2} onClick={() => handleClick("B3")} />
        <text x={180} y={245} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle">B3</text>

        <polygon points="860,195 770,195 780,280 875,280"
          fill="#7756ca" stroke="#fff" strokeWidth={2} onClick={() => handleClick("B4")} />
        <text x={820} y={245} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle">B4</text>

        {/* ===== C Blocks ===== */}
        <rect x={120} y={315} width={270} height={35} stroke="#fff" strokeWidth={2} fill="#5dade2"
          onClick={() => handleClick("C1")} />
        <text x={260} y={340} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle">C1</text>

        <rect x={610} y={315} width={270} height={35} stroke="#fff" strokeWidth={2} fill="#5dade2"
          onClick={() => handleClick("C2")} />
        <text x={750} y={340} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle">C2</text>

        {/* ===== D Blocks ===== */}
        <rect x={115} y={350} width={275} height={40} stroke="#fff" strokeWidth={2} fill="#2874a6"
          onClick={() => handleClick("D1")} />
        <text x={255} y={380} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle">D1</text>

        <rect x={610} y={350} width={280} height={40} stroke="#fff" strokeWidth={2} fill="#2874a6"
          onClick={() => handleClick("D2")} />
        <text x={755} y={380} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle">D2</text>

        {/* ===== E Blocks ===== */}
        <rect x={110} y={390} width={280} height={50} stroke="#fff" strokeWidth={2} fill="#154360"
          onClick={() => handleClick("E1")} />
        <text x={250} y={420} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle">E1</text>

        <rect x={400} y={390} width={200} height={50} stroke="#fff" strokeWidth={2} fill="#bdc3c7"
          onClick={() => handleClick("E2")} />
        <text x={500} y={420} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle">E2</text>

        <rect x={610} y={390} width={290} height={50} stroke="#fff" strokeWidth={2} fill="#154360"
          onClick={() => handleClick("E3")} />
        <text x={755} y={420} fill="white" fontSize={20} fontWeight="bold" textAnchor="middle">E3</text>
      </svg>
    </div>
  );
};

export default SeatMap;