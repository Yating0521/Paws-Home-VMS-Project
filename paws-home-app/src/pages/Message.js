import React, { useState, useEffect } from 'react';

function Message({ currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUserId) return;

    setLoading(true);
    fetch(`http://localhost:5000/api/messages/${currentUserId}`)

      .then(response => response.json())
      .then(data => {
        const msgs = Array.isArray(data) ? data : [];
        setMessages(msgs);
        if (msgs.length > 0) {
          setActiveMessage(msgs[0]);
          setActiveIndex(0);
        } else {
          setActiveMessage(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching messages:", err);
        setMessages([]);
        setActiveMessage(null);
        setLoading(false);
      });
  }, [currentUserId]);

  const showMessage = (index) => {
    setActiveMessage(messages[index]);
    setActiveIndex(index);
  };

  return (
    <div className="message-page">
      <div className="msg-container">
        <div className="msg-list">
          {loading ? (
            <p>Loading messages...</p>
          ) : messages.length === 0 ? (
            <p>No messages found.</p>
          ) : (
            <ul>
              {messages.map((message, index) => (
                <li
                  key={message.id || index}
                  className={activeIndex === index ? 'active' : ''}
                  onClick={() => showMessage(index)}
                  style={{ cursor: 'pointer' }}
                >
                  {message.title}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="msg-detail">
          {activeMessage && (
            <>
              <h2>{activeMessage.title}</h2>
              <p><strong>From:</strong> {activeMessage.sender_name}</p>
              <p><strong>Date:</strong> {activeMessage.date}</p>
              <p>{activeMessage.content}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;
