"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUpload } from "react-icons/fa";
import Swal from "sweetalert2";
import "./image.css";

interface MediaUploaderProps {
  type: "logo" | "background" | "logoOrganizer" | "video" | "soDoGhe";
  expectedSize?: { width: number; height: number }; 
  mediaType: "image" | "video"; 
  onUploadSuccess: (url: string) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ type, expectedSize, mediaType, onUploadSuccess }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMediaUrl = localStorage.getItem(`uploadedMedia_${type}`);
      if (savedMediaUrl) {
        setMediaUrl(savedMediaUrl);
        setPreview(savedMediaUrl);
      }
    }
  }, [type]);

  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Kiểm tra loại file
    if (mediaType === "video" && !file.type.startsWith("video/")) {
      Swal.fire({
        icon: "warning",
        title: "Lỗi!",
        text: "Vui lòng chọn file video (MP4)!",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (mediaType === "image" && !file.type.startsWith("image/")) {
      Swal.fire({
        icon: "warning",
        title: "Lỗi!",
        text: "Vui lòng chọn file ảnh!",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    if (mediaType === "image" && expectedSize) {

      // Kiểm tra kích thước ảnh
      const img = new Image();
      img.src = objectUrl;

      img.onload = async () => {
        if (img.width === expectedSize.width && img.height === expectedSize.height) {
          await uploadMedia(file, objectUrl);
        } else {
          Swal.fire({
            icon: "warning",
            title: "Lỗi!",
            text: `Ảnh không đúng kích thước! Vui lòng chọn ảnh ${expectedSize.width}x${expectedSize.height}.`,
            timer: 2000,
            showConfirmButton: false,
          });
        }
      };
    } else {
      
      // Upload video không cần kiểm tra kích thước
      await uploadMedia(file, objectUrl);
    }
  };

  const uploadMedia = async (file: File, objectUrl: string) => {
    setPreview(objectUrl);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", mediaType === "video" ? "event_videos" : "event_images");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${
          mediaType === "video" ? "video" : "image"
        }/upload`,
        formData
      );
      const uploadedMediaUrl = response.data.secure_url;
      setMediaUrl(uploadedMediaUrl);
      onUploadSuccess(uploadedMediaUrl);

      localStorage.setItem(`uploadedMedia_${type}`, uploadedMediaUrl);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: `Lỗi khi upload ${mediaType === "video" ? "video" : "ảnh"}: ${error}`,
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="text-center" style={{ width: type === "background" ? "73%" : type === "video" ? "50%" : type === "soDoGhe" ? "50%" : "26%", height: "max-content" }}>
      <label htmlFor={`${type}Upload`}
        className={`logo w-100 rounded-3 d-flex flex-column align-items-center justify-content-center cursor-pointer p-2 text-white ${type}-upload`}>
        {preview ? (
          mediaType === "video" ? (
            <video src={preview} autoPlay muted loop playsInline style={{ height: "100%", width: "100%" }}/>
          ) : (
            <img src={preview} alt={`Media ${type}`} style={{display : "none" ,height: "100%", width: "100%" }} />
          )
        ) : (
          <>
            <FaUpload size={40} className="text-success object-cover" />
            <p className="mt-3">
              Thêm {mediaType === "video" ? "video" : "ảnh"}{" "}
              {type === "logo" ? "logo sự kiện" : type === "background" ? "nền" : type === "logoOrganizer" ? "logo ban tổ chức" : type === "soDoGhe" ? "Sơ đồ ghế" : "Ảnh quảng bá"}
            </p>
            {mediaType === "image" && expectedSize && (
              <small>({expectedSize.width}x{expectedSize.height})</small>
            )}
          </>
        )}
      </label>
      <input id={`${type}Upload`} type="file" accept={mediaType === "video" ? "video/mp4" : "image/*"} className="d-none" onChange={handleMediaUpload}/>

      <div className="d-flex justify-content-between">
        <input type="text" className="form-control w-100 mt-2" value={mediaUrl || ""} readOnly />
      </div>
    </div>
  );
};

export default MediaUploader;