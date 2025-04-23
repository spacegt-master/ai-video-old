import request from "@/axios/ai-video-old-service.js";

export function list(uid) {
  return request({
    url: "/api/avatar/list",
    params: {
      uid,
    },
  });
}

export function info(id, creator) {
  return request({
    url: "/api/avatar/info",
    params: {
      id,
      creator,
    },
  });
}
