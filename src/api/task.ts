import request from "@/axios/ai-video-old-service.js";

export const TaskApi = {
  task(title: string, data: any) {
    return request({
      url: "/api/task",
      method: "post",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      params: {
        title,
      },
      data,
    });
  },
  run() {
    return request({
      url: "/api/task/run",
    });
  },
};
