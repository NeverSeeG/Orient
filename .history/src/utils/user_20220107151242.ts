class user {
  public static getUserInfo = {
    let info = {}
    let userString = localStorage.getItem('user')
    if(userString){
      info = JSON.parse(userString)
    }
  };
}
export { user };
