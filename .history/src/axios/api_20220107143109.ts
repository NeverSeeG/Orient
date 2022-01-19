import { Request } from "@/axios/request";

class api {
  /* api接口模块 */
  public static common = {
    login: (params?: any) => Request.get("/api/doLogin.rdm", params),
    getUserInfo: (params?: any) => Request.get("/api/gasShip/findUser.rdm",params),
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
    list:(params?: any) => Request.get("/api/gasShip/findShipDataForNOByMongo.rdm", params),
    /**
     * 当前船东下拉框数据
     * @param params userId
     * @returns 
     */
    getShipUnitCombo:(params?: any) => Request.get("/api/gasShip/getShipUnitCombo.rdm", params),
    /**
     * 当前船舶下拉数据
     * @param params  userId（用户id）；shipUnit（船舶单位）
     * @returns 
     */
     getShipNoCombo:(params?: any) => Request.get("/api/gasShip/getShipNoCombo.rdm", params),
  }
}

export { api };

