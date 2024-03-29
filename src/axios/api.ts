import axios from "@/axios/index";
import { Request } from "@/axios/request";
class api {
  /* api接口模块 */
  public static common = {
    login: (params?: any) => Request.post("/api/gasShip/shipLogin.rdm", params),
    getUserInfo: (params?: any) =>
      Request.get("/api/gasShip/findUser.rdm", params),
    genres: () => Request.get("/api/modelData/getAllModelData.rdm"),
    userList: (params?: any) =>
      Request.get("/api/user/listByFilter.rdm", params),
    userCreate: (params?: any) =>
      Request.formData("/api/user/create.rdm", params),
    userUpdate: (params?: any) =>
      Request.formData("/api/user/update.rdm", params),
    deleteUser: (toDelIds: string) => {
      return axios({
        url: "/api/user/delete.rdm",
        method: "delete",
        params: {
          toDelIds: toDelIds,
        },
      });
    },
    deptList: (params: any) => Request.get("/api/dept/getByPid.rdm", params),
    deptTreeList: (params: any) => Request.get("/api/dept/list.rdm", params),
    saveDept: (params?: any) =>
      Request.formData("/api/dept/create.rdm", params),
    updateDept: (params?: any) =>
      Request.formData("/api/dept/update.rdm", params),
    deleteDept: (toDelIds: string) => {
      return axios({
        url: "/api/dept/delete.rdm",
        method: "delete",
        params: {
          toDelIds: toDelIds,
        },
      });
    },
    getRoles: (params?: any) => Request.get("/api/role/list.rdm", params),
    saveRole: (params?: any) =>
      Request.formData("/api/role/create.rdm", params),
    updateRole: (params?: any) =>
      Request.formData("/api/role/update.rdm", params),
    listUsers: (params?: any) => Request.get("/api/role/listUsers.rdm", params),
    saveAssignUsers: (params?: any) =>
      Request.formData("/api/role/saveAssignUsers.rdm", params),
    deleteRole: (toDelIds: string) => {
      return axios({
        url: "/api/role/delete.rdm",
        method: "delete",
        params: {
          toDelIds: toDelIds,
        },
      });
    },
    // 获取角色功能点
    treeRoleFunctions: (params?: any) =>
      Request.get("/api/role/treeRoleFunctions.rdm", params),
    // 角色分配功能点
    saveAssignFunctions: (params?: any) =>
      Request.formData("/api/role/saveAssignFunctions.rdm", params),
    // 获取所有功能点
    getFuncById: (params?: any) =>
      Request.get("/api/func/getByPid.rdm", params),
    // 查询当前用户下的 功能点列表
    getSubFunctions: (params?: any) =>
      Request.get("/api/func/getSubFunctions1.rdm", params),
    // 创建功能点
    createFunc: (params?: any) =>
      Request.formData("/api/func/create.rdm", params),
    updateFunc: (params?: any) =>
      Request.formData("/api/func/update.rdm", params),
    deleteFunc: (toDelIds: string) => {
      return axios({
        url: "/api/func/delete.rdm",
        method: "delete",
        params: {
          toDelIds: toDelIds,
        },
      });
    },
  };

  public static EnumCombobox = {
    getEnumCombobox: (params?: any) =>
      Request.get("/api/orientForm/getEnumCombobox.rdm", params),
    // 角色分配功能点
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
    getShipDetailsForNameAndNo: (params?: any) =>
      Request.get("/api/gasShip/findShipDataForNameAndNo.rdm", params),
    /**
     * 根据船舶ID找到对应的设备
     * @param params shipId 船舶ID
     * @returns
     */
    getEquipmentForShipId: (params?: any) =>
      Request.get("/api/gasEquipParas/getEquipCombo.rdm", params),
    /**
     * 通过设备ID获取对应的参数
     * @param params equipIds设备ID
     * @returns
     */
    getParasCombo: (params?: any) =>
      Request.get("/api/gasEquipParas/getParasCombo.rdm", params),
    /**
     *
     * @param params no（船舶代号），equipId（设备id），paraIds（参数id字符串，例如“1;2”）
     */
    findParasDataByMongo: (params?: any) =>
      Request.get("/api/gasData/findParasDataByMongo.rdm", params),

    /**
     * 导出数据
     * @param params no（船舶代号）、
     * equipNames（设备名称字符串，比如：“空压机;轴流风机”）、
     * equipIds（设备id字符串，比如：“1;2”）、
     * paraNames（参数名称字符串。每个设备Time+选中的参数名称,比如“Time,空压机开关,空压机转速;Time,轴流风机开关”）、
     * paraIds（参数id字符串，此处不需要加Time，比如“1,2;3”）、
     * startTime（开始时间，格式“yyyy-MM-dd hh:mm:ss”）、
     * endTime（结束时间，格式“yyyy-MM-dd hh:mm:ss”）
     * @returns
     */
    exportParasData: (params?: any) =>
      Request.get("/api/gasExport/exportParasData.rdm", params),

    /**
     * 2.	参数下拉框数据
     * @param params shipId（船舶id）
     * @returns List<Map<String, String>>值：NAME_4129（参数名称，显示）、NO_4129（参数代号）
     */
    getCommandParasCombo: (params?: any) =>
      Request.get("/api/gasEquipParas/getCommandParasCombo.rdm", params),
    /**
     *  获取指令列表
     * @param params page:第几页,limit:每页多少条 no（船舶代号）、opNo（参数代号字符串，比如“zfcs1, zfcs2”）、startTime（开始时间，格式“yyyy-MM-dd hh:mm:ss”）、endTime（结束时间格式“yyyy-MM-dd hh:mm:ss”）
     * @returns  List<Map<String, String>>值：OpTime（发送时间）、OpName（指令名称）、
     * ExeData（指令值）、SendResult（发送结果）、TimeOut（执行结果）
     *  */
    findCmdDataByMongo: (params: any) =>
      Request.get("/api/gasData/findCmdDataByMongo.rdm", params),

    /**
     * 指令导出
     * no（船舶代号）、opNo（参数代号字符串，比如“zfcs1, zfcs2”）、startTime（开始时间，格式“yyyy-MM-dd hh:mm:ss”）、endTime（结束时间格式“yyyy-MM-dd hh:mm:ss”）
     * @param params
     * @returns AjaxResponseData值：fileid（JSON.parse(data).results['fileid'].toString()）
     */
    exportCommandData: (params: any) =>
      Request.get("/api/gasExport/exportCommandData.rdm"),
  };

  /**
   * 船舶管理
   */
  public static ship = {
    /**
     * 查询船舶列表
     * @param params page:页码;limit（每页数据量）
     * @returns
     */
    list: (params?: any) =>
      Request.get("/api/gasShip/findShipData.rdm", params),
    getById: (params?: any) =>
      Request.get("/api/gasShip/findShipDataForShipId.rdm", params),
    updateData: (params?: any) =>
      Request.post("/api/gasShip/updateShipData.rdm", params),
    insertShipData: (params?: any) =>
      Request.post("/api/gasShip/insertShipData.rdm", params),
    importData: (params?: any, data?: any) =>
      Request.customer("/api/gasImport/importEquipParasData.rdm", params, data),
    deleteData: (params?: any) =>
      Request.get("/api/gasShip/deleteShipData.rdm", params),

    findUserForShip: (params?: any) =>
      Request.get("/api/gasShip/findUserForShipId.rdm", params),
    /**
     * 绑定船舶跟用户关系
     * @param params shipId（船舶id）、userId（用户id）
     * @returns
     */
    insertShipUser: (params?: any) =>
      Request.formData("/api/gasShip/insertShipUser.rdm", params),
  };

  public static homeAdmin = {
    getList: (params?: any) =>
      Request.get("/api/gasShip/findMainPic.rdm", params),
    deleteImg: (fileIds: string) => {
      return axios({
        url: "/api/gasShip/deleteMainPic.rdm",
        method: "delete",
        params: {
          fileIds: fileIds,
        },
      });
    },
    updateMainPicState: (params?: any) =>
      Request.post("/api/gasShip/updateMainPicState.rdm", params),
    updateMainPicDesc: (params?: any) =>
      Request.post("/api/gasShip/updateMainPicDesc.rdm", params),
    getFile: (file: string) => {
      return axios({
        url: `/api/gasExport/getMainPicForFileId/${file}.rdm`,
        method: "GET",
        responseType: "blob",
      });
    },
    saveData: (file, desc) => {
      return axios({
        url: "/api/gasImport/importMainPic.rdm",
        method: "post",
        data: file,
        params: {
          desc,
        },
      });
    },
    findDefMainPic: () => Request.get("/api//gasShip/findDefMainPic.rdm"),
  };
}

export { api };

