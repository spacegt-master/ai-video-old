import request from "@/axios/ai-video-old-service.js";

export interface Project {
  id: string;
  name: string;
  config: string;
}

export const ProjectApi = {
  list() {
    return request({
      url: "/api/project/list",
    });
  },
  info(id: string) {
    return request({
      url: "/api/project/" + id,
    });
  },
  save(data: Project) {
    return request({
      url: "/api/project/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
  del(id: string) {
    return request({
      url: "/api/project/del/" + id,
      method: "post",
    });
  },
};
