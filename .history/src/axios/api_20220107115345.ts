import { Request } from "@/axios/request";

class api {
  /* api接口模块 */
  public static common = {
    login: (params?: any) => Request.get("/api/doLogin.rdm", params),
    getUserInfo: (params?: any) => Request.get("/api/getUserInfo.rdm",params)
    genres: () => Request.get("/api/modelData/getAllModelData.rdm"),
  };

  /**
   * 船舶汇总
   */
  public static shipSummary ={
    /**
     * 船舶汇总列表
     * @param params  no（船舶代号）
     * @returns 
     */
    list:(params?: any) => Request.get("/api/gasShip/findShipDataForNOByMongo.rdm", params)
  }
}

export { api };

