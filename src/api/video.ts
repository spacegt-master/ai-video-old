import request from "@/axios/ai-video-old-service.js";

export const VideoApi = {
  list() {
    return request({
      url: "/api/video/list",
    });
  },

  del(id: string) {
    return request({
      url: "/api/video/del/" + id,
      method: "post",
    });
  },

  rename(id: string, name: string) {
    return request({
      url: "/api/video/rename",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {
        id,
        name,
      },
    });
  },
};
