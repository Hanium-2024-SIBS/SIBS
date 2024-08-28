import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ChatRoom.css';
import SettingsIcon from '@mui/icons-material/Settings';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';

const SERVER_URL = 'http://localhost:5000'; // Python server URL

const userImages = [
  'https://i.pravatar.cc/150?img=2'
];

const userNames = ['User3'];

function ChatRoom() {
  const dummy = useRef();
  const chatContainerRef = useRef();
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState('');
  const [userId] = useState(uuidv4());
  const [userImage] = useState(userImages[Math.floor(Math.random() * userImages.length)]);
  const [userName] = useState(userNames[Math.floor(Math.random() * userNames.length)]);
  const [dislikedUsers, setDislikedUsers] = useState(new Set());
  const [likedUsers, setLikedUsers] = useState(new Set());
  
  const navigate = useNavigate(); // Use the useNavigate hook

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
  
    if (!formValue.trim()) return; // Prevent sending empty messages
  
    try {
      console.log("Sending message for profanity check:", formValue);
      const response = await axios.post(`${SERVER_URL}/predict`, { message: formValue });
      console.log("Server response:", response.data);
  
      const { isProfanity, error } = response.data;
  
      if (error) {
        console.error('Server error:', error);
        return;
      }
  
      let newMessage;
      if (isProfanity) {
        console.log("Profanity detected, blocking message");
        newMessage = {
          id: uuidv4(),
          text: `${userName}의 채팅이 차단되었습니다`,
          createdAt: new Date(),
          uid: "system",
          photoURL: "",
          userName: "SIBS✅",
          likes: 0,
          dislikes: 0,
          isWarning: true
        };
      } else {
        console.log("Message is clean, sending to chat");
        newMessage = {
          id: uuidv4(),
          text: formValue,
          createdAt: new Date(),
          uid: userId,
          photoURL: userImage,
          userName: userName,
          likes: 0,
          dislikes: 0
        };
      }

      console.log("Emitting message:", newMessage);

      // Add message to UI immediately
      setMessages((messages) => [newMessage, ...messages]);
      setFormValue('');
    } catch (err) {
      console.error('Error in profanity check:', err.message);
    }
  };

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
