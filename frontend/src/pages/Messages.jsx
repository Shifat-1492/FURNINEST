import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    axios.get('http://localhost:5001/api/messages/inbox')
      .then(res => {
        setMessages(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user, navigate]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:5001/api/messages/${id}/read`);
      setMessages(messages.map(m => m._id === id ? { ...m, read: true } : m));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Inbox</h1>
      
      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading messages...</div>
      ) : messages.length > 0 ? (
        <div className="flex flex-col gap-4">
          {messages.map(msg => {
            const isSender = msg.sender._id === user._id;
            const otherPerson = isSender ? msg.receiver : msg.sender;
            return (
              <div key={msg._id} className={`bg-white p-6 rounded-2xl shadow-sm border ${!msg.read && !isSender ? 'border-green-500 bg-green-50' : 'border-gray-100'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {isSender ? `To: ${otherPerson.name}` : `From: ${otherPerson.name}`}
                    </h3>
                    <p className="text-sm text-gray-500">Re: {msg.listing?.title || 'Deleted Listing'}</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{msg.body}</p>
                {!msg.read && !isSender && (
                  <button onClick={() => markAsRead(msg._id)} className="mt-4 text-sm text-green-700 font-semibold hover:underline">
                    Mark as Read
                  </button>
                )}
                <div className="mt-4 flex gap-2">
                  {!isSender && (
                    <button 
                      onClick={() => navigate(`/listing/${msg.listing?._id}?replyTo=${otherPerson._id}`)} 
                      className="btn btn-outline text-sm py-1 px-4"
                    >
                      Reply
                    </button>
                  )}
                  {msg.listing && (
                    <button 
                      onClick={() => navigate(`/listing/${msg.listing._id}`)} 
                      className="text-sm text-gray-500 hover:text-green-700 hover:underline px-2"
                    >
                      View Listing
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <div className="text-6xl mb-4">📫</div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">No messages</h2>
          <p className="text-gray-500">Your inbox is empty.</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
