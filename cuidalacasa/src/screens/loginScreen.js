import React from "react";
import { useSession } from '../auth/auth';
import { Navigate } from "react-router";

import authService from "../services/auth/authService"
import imgLogin from "../img/pets2.png"
import {Typography} from "@mui/material";

export default function LoginScreen() {

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [message2, setMessage2] = React.useState("");

  const session = useSession()

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  let handleSingUp = async (e) => {
    try {
      console.log("Handle Submit Register, email:"+email+",password:"+password)

      authService.registerUser(email, password)

      setMessage2(null)
      setMessage("Usuario creado satisfactoriamente!\nRedirigiendo a la página de la app...")

      await sleep(3000)
      const userId = authService.getUserId(email)
      session.login(userId)

    } catch(err) {
      console.log(err)
      setMessage(null)
      setMessage2(err.toString())
    }
  }

  let handleLogin = async (e) => {
    try {
      authService.checkUserRegister(email, password)

      setMessage(null)
      setMessage2(null)

      const userId = authService.getUserId(email)
      session.login(userId)
    } catch(err){
      console.log(err)
      setMessage(null)
      setMessage2(err.toString())
    }
  }

  const mainDivStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C23EBEE8",
    height: "940px",
  }

  const divStyles = {
    width: "400px",
    backgroundColor: "#fef3ff",
    borderRadius: "15px",
    border: "1px solid black",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: "48px",
    marginTop: "48px"
  }

  const inputStyles = {
    fontSize: "1.1em",
    fontWeight: "500",
    margin: "10px",
    padding: "0.5rem",
    height: "2rem",
    borderRadius: "8px",
  }

  const buttonStyles = {
    borderRadius: "8px",
    padding:"10px",
    margin:"10px",
    width: "30%"
  }

  const pStyles = {
    textAlign: "center"
  }

  const messageStyles = {
    fontSize: "1.2em",
    textAlign: "center",
  }

  const buttonsDiv = {
    display: "flex",
    justifyContent: "space-evenly"
  }
  
  return (

    <div style={mainDivStyles}>
      <Typography variant="h2" style={{color: "white"}}
        >¡Bienvenido a CuidaLaCasa!
      </Typography>
      <Navigate to="/signin" replace />
      <div style={divStyles}>
        <input style={inputStyles}
          type="text"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input style={inputStyles}
          type="password"
          value={password}
          placeholder="Password"

          onChange={(e) => setPassword(e.target.value)}
          
        />

        <div style={buttonsDiv}>
          <button
            className="signin--btn"
            style={buttonStyles}
            onClick={ (e) => handleSingUp() } >
              Registro
          </button>

          <button
            className="signin--btn"
            style={buttonStyles}
            onClick={ (e) => handleLogin() } >
              Login
          </button>
        </div>

        <div style={{color: "#36a936", ...messageStyles}}>
          {message ? <p style={pStyles}>{message}</p> : null}
        </div>
        <div style={{color: "red", ...messageStyles}}>
          {message2 ? <p style={pStyles}>{message2}</p> : null}
        </div>
      </div>
      <img src={imgLogin} height="350px" width="550px"/>
      <footer>Copyright &copy; cuidalacasa.com - v0.6.0-202306140255 </footer>
    </div>
  );
}
