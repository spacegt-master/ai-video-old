import request from "@/axios/ai-video-old-service.js";

export const filePath = import.meta.env.VITE_APP_FILE_RESOURCE + "/";

export function upload(file, path) {
  return request({
    url: import.meta.env.VITE_APP_FILE_API + "/upload",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: {
      file,
      path,
    },
  });
}

export function download(url) {
  return request({
    url: import.meta.env.VITE_APP_FILE_RESOURCE + "/" + url,
    responseType: "blob",
    withCredentials: false,
  });
}

export function ppt2image(file) {
  return request({
    url: import.meta.env.VITE_APP_FILE_API + "/ppt/ppt2image",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: {
      file,
    },
  });
}

export function ppt2imageTo(file, onUploadProgress) {
  return request({
    url: import.meta.env.VITE_APP_FILE_API + "/ppt/ppt2image",
    requiresAuth: true,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: {
      file,
    },
    onUploadProgress: onUploadProgress,
  });
}

export function uploadTo(file, path, onUploadProgress) {
  return request({
    url: import.meta.env.VITE_APP_FILE_API + "/upload",
    requiresAuth: true,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: {
      file,
      path,
    },
    onUploadProgress: onUploadProgress,
  });
}
