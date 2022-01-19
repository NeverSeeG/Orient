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
    getShipDetailsForNameAndNo: (params?: any) => Request.get("/api/gasShip/findShipDataForNameAndNo.rdm", params),
    /**
     * 根据船舶ID找到对应的设备
     * @param params shipId 船舶ID
     * @returns 
     */
    getEquipmentForShipId: (params?: any ) => Request.get("/api/gasEquipParas/getEquipCombo.rdm", params),
    /**
     * 通过设备ID获取对应的参数
     * @param params equipIds设备ID
     * @returns 
     */
    getParasCombo: (params?: any) => Request.get("/api/gasEquipParas/getParasCombo.rdm", params),
    /**
     * 
     * @param params no（船舶代号），equipId（设备id），paraIds（参数id字符串，例如“1;2”）
     */
    findParasDataByMongo:(params?: any) => Request.get("/api/gasData/findParasDataByMongo.rdm",params),


    /**
     * 导出数据
     * @param params 
     * @returns 
     */
    exportParasData:(params?: any) => Request.get("/api/gasExport/exportParasData.rdm", params)
  };
}

export { api };

