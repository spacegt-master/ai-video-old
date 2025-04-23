import request from "@/axios/ai-video-old-service.js";

export const DurationCodeApi = {
  list() {
    return request({
      url: "/api/duration-code/list",
    });
  },

  generate(duration: number) {
    return request({
      url: "/api/duration-code/generate",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        duration,
      },
    });
  },

  use(code: string) {
    return request({
      url: "/api/duration-code/use",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        code,
      },
    });
  },

  del(id: string) {
    return request({
      url: "/api/duration-code/del",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        id,
      },
    });
  },
};
