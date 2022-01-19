class User {
  userInfo;
  constructor(){
    let userString = localStorage.getItem("user");
    if (userString) {
      this.userInfo =JSON.parse(userString);
    }
  }
}
export { User };
