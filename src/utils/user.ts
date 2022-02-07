class User {
  deptName;
  roleIds;
  userName;
  userId;
  roleNames;
  constructor(){
    let userString = localStorage.getItem("user");
    if (userString) {
      let userInfo =JSON.parse(userString);
      this.deptName = userInfo.deptName;
      this.roleIds = userInfo.roleIds;
      this.userName = userInfo.userName;
      this.userId = userInfo.userId;
      this.roleNames = userInfo.roleNames;
    }
  }
}
export { User };

