import request from "@/axios/multi-tool-hub-service.js";

export const ImagesegApi = {
  segmentBody(data: { Image: File; ReturnForm?: string }) {
    return request({
      url: "/api/imageseg/segment-body",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
};

export const VideosegApi = {
  segmentVideoBody(data: { Video: File }) {
    return request({
      url: "/api/videoseg/segment-video-body",
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    });
  },
};
