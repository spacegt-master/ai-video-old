import request from "@/axios/speech-services";

export const VoicesApi = {
  list() {
    return request({
      url: "/api/voices/list",
    });
  },

  synthesis(data: {
    name: string;
    text: string;
    rate: string;
    pitch: string;
    volume: string;
  }) {
    return request({
      url: "/api/speech/synthesis",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data,
    });
  },
  training(data: {
    file: File;
    name?: string;
    displayName: string;
    source: string;
    type: string;
    description: string;
    locale: string;
    ageGroups: string;
    gender: string;
  }) {
    return request({
      url: "/api/speech/training",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
};
