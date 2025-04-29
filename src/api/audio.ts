import request from "@/axios/ai-video-old-service.js";

export const AudioApi = {
  list() {
    return request({
      url: "/api/audio/list",
    });
  },
  save(name: string, duration: number, uri: string, config: string) {
    return request({
      url: "/api/audio/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: { name, duration, uri, config },
    });
  },
  del(id: string) {
    return request({
      url: `/api/audio/del/${id}`,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  rename(id: string, name: string) {
    return request({
      url: `/api/audio/rename/${id}/${name}`,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  tts({ pitch, voice, speed, volume, text }: any) {
    return request({
      url: "/api/4utech/tts",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        pitch,
        voice_name: voice,
        speed,
        volume,
        text,
        audioType: "wav",
        supplier_type: 8,
      },
    });
  },
};
