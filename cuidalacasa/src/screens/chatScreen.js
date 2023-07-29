import React, {useLayoutEffect, useRef, useState, useCallback} from "react";
import {collection, limit, onSnapshot, orderBy, query} from "firebase/firestore";
import {db} from "../firebase/firebase";
import Message from "../components/Message";
import SendMessage from "../components/SendMessage";
import * as utils from "../others/utils";
import {useLocation} from 'react-router-dom';

const ChatScreen = () => {
        const location = useLocation();
        const {emitterId, receptorId} = location.state;
        const [messages, setMessages] = useState([]);
        const [alreadyExistChatWithMessages, setAlreadyExistChatWithMessages] = useState(false);
        const scroll = useRef();

        useLayoutEffect(() => {
                const unsubscribe = onSnapshot(query(
                    collection(db, utils.getChatId(emitterId, receptorId)),
                    orderBy("createdAt"),
                    limit(50)
                ), snapshots => {
                    const msgs = snapshots.docs
                        .map(doc => ({...doc.data(), id: doc.id}))
                        .sort((a, b) => a.createdAt - b.createdAt);
                    setMessages(msgs);
                    setAlreadyExistChatWithMessages(msgs.length > 0);
                });
                return () => unsubscribe;}
            , []);

        return (
            <main className="chat-box">
                <div className="messages-wrapper">
                    {messages?.map((message) => (
                        <Message key={message.id} message={message}/>
                    ))}
                </div>
                {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
                <span ref={scroll}></span>
                <SendMessage scroll={scroll} emitterId={emitterId} receptorId={receptorId} existChat={alreadyExistChatWithMessages}/>
            </main>
        );
    }
;

export default ChatScreen;
