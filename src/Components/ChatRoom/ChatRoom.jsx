import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useMutation, useSubscription } from '@apollo/client';
import { GET_CHAT_STREAM, GET_CHAT_STREAM_FILTERED, INSERT_CHAT } from '../../Query/query';
import { useNavigate } from 'react-router-dom';  // useNavigate import 추가

import './ChatRoom.css';
import SettingsIcon from '@mui/icons-material/Settings';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';

const userImages = [
  'https://i.pravatar.cc/150?img=2'
];

const chat = {
  "Entrance": "2024-07-28T04:00",
  // TODO: 추후 입장 시간을 아래와 같이 변경 필요
  // "Entrance": new Date().toISOString(),
  "Room": 5
};

const userNames = ['User3'];

function ChatRoom() {
  const dummy = useRef();
  const chatContainerRef = useRef();
  const navigate = useNavigate();  // useNavigate 훅을 사용하여 navigate 함수 정의
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState('');
  const [userId] = useState(uuidv4());
  const [userImage] = useState(userImages[Math.floor(Math.random() * userImages.length)]);
  const [userName] = useState(userNames[Math.floor(Math.random() * userNames.length)]);
  const [dislikedUsers, setDislikedUsers] = useState(new Set());
  const [likedUsers, setLikedUsers] = useState(new Set());
  const [insertChat] = useMutation(INSERT_CHAT);
  // TODO: 채팅 상황에 따라 추후 query.js의 batch_size 변경 필요. 현재 10개로 설정됨
  const { loading: chatLoading, error: chatError, data: chatData } = useSubscription(GET_CHAT_STREAM, { variables: chat });
  const { loading: filteredLoading, error: filteredError, data: filteredData } = useSubscription(GET_CHAT_STREAM_FILTERED, { variables: chat });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    console.log("Messages:", messages);
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!formValue.trim()) return; // 빈 메시지 전송 방지

    try {
      console.log("Sending message for profanity check:", formValue);

      // TODO: 추후 서버의 uid와 room_id를 받아오는 작업 필요
      await insertChat({ variables: { chat: { content: formValue, sender_id: 44, chat_room_id: 5 } } });

      setFormValue('');
    } catch (err) {
      console.error('Error in profanity check:', err.message);
    }
  };

  useEffect(() => {
    console.log("Data:", chatData);
    if (chatData && chatData.Chat_log_stream) {
      for (const chatLogStreamElement of chatData.Chat_log_stream) {
        let newMessage = {
          // id: uuidv4(),
          text: chatLogStreamElement['content'],
          createdAt: chatLogStreamElement['sent_at'],
          // uid: userId,
          // photoURL: userImage,
          userName: userName,
          likes: 0,
          dislikes: 0,
          messageId: chatLogStreamElement['message_id'],
          senderId: chatLogStreamElement['sender_id'],
          isFiltered: chatLogStreamElement['is_filtered']
        }

        setMessages(prevMessages => [...prevMessages, newMessage]);
      }
    }
  }, [chatData]);

  useEffect(() => {
    console.log("Data:", filteredData);
    if (filteredData && filteredData.Chat_log_stream) {
      for (const chatLogStreamElement of filteredData.Chat_log_stream) {
        setMessages(prevMessages =>
          prevMessages.map(message =>
            message.messageId === chatLogStreamElement['message_id']
              ? {
                ...message,
                text: `${userName}의 채팅이 차단되었습니다`,
                isWarning: true
              } // messageId가 일치하면 text를 변경
              : message // 일치하지 않으면 기존 message 반환
          )
        );
      }
    }
  }, [filteredData]);

  if (chatLoading || filteredLoading) {
    // console.log("Loading...");
  }
  if (chatError) {
    // console.log("Error:", chatError.message);
  }
  if (filteredError) {
    // console.log("Error:", filteredError.message);
  }

  const handleVoteClick = () => {
    navigate('/overlaypoll'); // Navigate to OverlayPoll
  };

  const handleWheelSpinnerClick = () => {
    navigate('/wheelspinner'); // Navigate to WheelSpinner
  };

  return (
    <div className="chat-room">
      <header className='chat-header'>
        <h1>채팅방</h1>
        <div className="header-icons">
          <SettingsIcon className="material-icons settings-icon" />
          <HowToVoteIcon className="material-icons vote-icon" onClick={handleVoteClick} />
          <DonutLargeIcon className="material-icons donut-icon" onClick={handleWheelSpinnerClick} />
        </div>
      </header>
      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((msg, index) =>
          <ChatMessage
            key={index}
            message={msg}
            dislikedUsers={dislikedUsers}
            likedUsers={likedUsers}
          />
        )}
        <span ref={dummy}></span>
      </div>
      <form className='chatroom-container' onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="채팅을 입력해주세요" />
        <button type="submit">보내기</button>
      </form>
    </div>
  );
}

function ChatMessage({ message, onLike, onDislike, dislikedUsers, likedUsers }) {
  const { text, photoURL, userName, likes, dislikes, uid, isWarning } = message;

  return (
    <div className={`message ${userName === "SIBS✅" ? "system-message" : ""}`}>
      {photoURL && <img src={photoURL} alt="User Avatar" />}
      <div className="message-content">
        <div className="message-header">
          <div className="username" style={{ color: likes >= 30 ? '#99f77c' : dislikedUsers.has(uid) ? 'red' : 'black' }}>{userName}</div>
        </div>
        <p style={{ color: isWarning ? 'red' : 'black' }}>{text}</p>
        {userName !== "SIBS✅" && (
          <div className="message-actions">
            <button onClick={onLike}>👍 {likes}</button>
            <button onClick={onDislike}>👎 {dislikes}</button>
            <button>번역</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatRoom;
