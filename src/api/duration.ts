import request from "@/axios/ai-video-old-service.js";

export const DurationApi = {
  info() {
    return request({
      url: "/api/duration/info",
    });
  },
};
