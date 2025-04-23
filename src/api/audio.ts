import request from "@/axios/ai-video-old-service.js";

export const AudioApi = {
  list() {
    return request({
      url: "/api/audio/list",
    });
  },
  save(name, duration, uri, config) {
    return request({
      url: "/api/audio/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: { name, duration, uri, config },
    });
  },
  del(id) {
    return request({
      url: `/api/audio/del/${id}`,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  rename(id, name) {
    return request({
      url: `/api/audio/rename/${id}/${name}`,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  tts({ pitch, voice, speed, volume, text }) {
    return request({
      url: "/api/4utech/tts",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: { pitch, voice, speed, volume, text },
    });
  },
};
