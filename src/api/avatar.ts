import request from "@/axios/ai-video-old-service.js";
import type { Avatar } from "@/types/avatar";

export const AvatarApi = {
  list(uid: string) {
    return request({
      url: "/api/avatar/list",
      params: {
        uid,
      },
    });
  },
  info(id: string, creator: string) {
    return request({
      url: "/api/avatar/info",
      params: {
        id,
        creator,
      },
    });
  },
  save(data: Avatar) {
    return request({
      url: "/api/avatar/save",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
};
