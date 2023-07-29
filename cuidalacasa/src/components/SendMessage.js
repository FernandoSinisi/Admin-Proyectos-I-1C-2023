import React, {useState} from "react";
import {addDocIntoCollection} from "../firebase/firebase";
import {serverTimestamp} from "firebase/firestore";
import * as utils from "../others/utils";
import {Button} from "@mui/material";
import ProfileService from "../services/profile/profileService";
import emailjs from "emailjs-com";
import emailjsConfig from "../emailjs/emailjs";

const SendMessage = (props) => {
    const [message, setMessage] = useState("");
    const emitterProfile = ProfileService.getProfile(props.emitterId);
    const receptorProfile = ProfileService.getProfile(props.receptorId);

    const newDoc = {
        text: message,
        name: emitterProfile.name,
        avatar: emitterProfile.picture,
        createdAt: serverTimestamp(),
        uid: props.emitterId
    }

    const sendMessage = async (event) => {
        event.preventDefault();
        if (message.trim() === "") {
            alert("No se puede enviar un mensaje vacio");
            return;
        }
        await addDocIntoCollection(utils.getChatId(props.emitterId, props.receptorId), newDoc);
        setMessage("");
        props.scroll.current.scrollIntoView({behavior: "smooth"});

        // Enviar mail de nuevo chat
        if(!props.existChat){
            const mailParams = {
                subject: 'Nuevo Chat',
                msg: `Estimado ${receptorProfile.name},\n` + '\n' +
                    `${emitterProfile.name} ha abierto un nuevo chat contigo.` + '\n' +
                    `Si deseas contestarle lo puedes hacer desde la plataforma.\n`,
                toEmail: receptorProfile.email
            }

            
            emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, mailParams, emailjsConfig.userId)
                .then((result) => {
                    console.log("Email sent.")
                }, (error) => {
                    console.log(error.text)
            })
        }

    };

    return (
        <form onSubmit={(event) => sendMessage(event)} className="send-message">
            <label htmlFor="messageInput" hidden>
                Enter Message
            </label>
            <input
                id="messageInput"
                name="messageInput"
                type="text"
                className="form-input__input"
                placeholder="type message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit">Send</Button>
        </form>
    );
};

export default SendMessage;
