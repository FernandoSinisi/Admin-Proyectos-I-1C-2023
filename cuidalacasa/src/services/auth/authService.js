import initialData from "./authData"
import profileService from "../profile/profileService"

class AuthService {
  users

  constructor(initialData) {
    this.users = new Map();
    for (let i = 0; i < initialData.length; i ++) {
      this.users.set(initialData[i].email, {
        userId: (i+1).toString(),
        email: initialData[i].email,
        password: initialData[i].password
      })
    }
  }

  registerUser(email, password) {

    const userId = (1+this.users.size).toString()
    const expressionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!(expressionRegular.test(email))) {
      throw new Error("Email incorrecto");
    }
    if(password.length < 1 || email.length < 1){
      throw new Error("El Usuario y password debe tener tamaño mayor a 0");
    }

    if( this.users.get(email) === undefined ) {
    	this.users.set(email, {userId: userId, email: email, password: password})
    } else {
    	throw new Error("Usuario ya registrado")
    }

    profileService.addProfile({userId: userId, name: email.substring(0, email.indexOf("@")), email:email, subscription:"Basic"})
  }

  checkUserRegister(email, password) {
    const userRegister = this.users.get(email)
  	if( userRegister === undefined || userRegister.password !== password ) {
  		throw new Error("El Usuario no esta registrado o password incorrecta")
  	}
  }

  getUserId(email) {
    if( this.users.get(email) === undefined ) {
  		throw new Error("El Usuario no esta registrado")	
  	} else {
      return this.users.get(email).userId
    }
  }
}

const authService = new AuthService(initialData)
export default authService
