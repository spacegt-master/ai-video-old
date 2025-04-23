import axios from "@/axios/accounts-service";

export const TokenApi = {
  validate(token: string) {
    return axios({
      url: `/api/token/validate/${token}`,
      method: "get",
    });
  },
};
