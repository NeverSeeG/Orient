import { Request } from "@/axios/request";

class api {
  /* api接口模块 */
  public static common = {
    login: (params?: any) => Request.get("/api/doLogin.rdm", params),
    getUserInfo: (params?: any) =>
      Request.get("/api/gasShip/findUser.rdm", params),
    genres: () => Request.get("/api/modelData/getAllModelData.rdm"),
  };

  /**
   * 船舶汇总
   */
  public static shipSummary = {
    /**
     * 船舶汇总列表
     * @param params  no（船舶代号）
     * @returns
     */
    list: (params?: any) =>
      Request.get("/api/gasShip/findShipDataForNOByMongo.rdm", params),
    /**
     * 当前船东下拉框数据
     * @param params userId
     * @returns
     */
    getShipUnitCombo: (params?: any) =>
      Request.get("/api/gasShip/getShipUnitCombo.rdm", params),
    /**
     * 获取船舶下拉数据
     * @param params  userId（用户id）；shipUnit（船舶单位）
     * @returns
     */
    getShipNoCombo: (params?: any) =>
      Request.get("/api/gasShip/getShipNoCombo.rdm", params),

    /**
     * 根据船舶名称船舶代号获取船舶详情
     * @param params 入参：name（船舶名称）；no（船舶代号）
     * @returns 
     */
    getShipDetailsForNameAndNo: (params?: any) => Request.get("/api/gasShip/findShipDataForNameAndNo.rdm")
  };
}

export { api };

