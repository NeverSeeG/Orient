import { Request } from "@/axios/request";

class api {
  /* api接口模块 */
  public static common = {
    login: (params?: any) => Request.get("/api/doLogin.rdm", params),
    genres: () => Request.get("/api/modelData/getAllModelData.rdm"),
  };
}

export { api };

