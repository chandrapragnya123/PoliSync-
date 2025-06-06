// Updated Chatbot.jsx without firNumber references
import { useState, useEffect } from 'react';
import '../styles/chatbot.css';

const initialFirData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  incidentDate: '',
  incidentLocation: '',
  description: '',
  crimeType: '',
};

const questions = [
  { key: 'name', prompt: "What's your full name?" },
  { key: 'email', prompt: "What's your email address?" },
  { key: 'phone', prompt: "What's your phone number?" },
  { key: 'address', prompt: "What's your address?" },
  { key: 'incidentDate', prompt: "When did the incident occur? (YYYY-MM-DD)" },
  { key: 'incidentLocation', prompt: "Where did the incident happen?" },
  { key: 'description', prompt: "Please describe the incident in detail." },
];

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { text: "Hi! I can help you file a complaint. Let's get started.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [firData, setFirData] = useState(initialFirData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [awaitingCrimeConfirmation, setAwaitingCrimeConfirmation] = useState(false);
  const [isAwaitingSubmissionConfirmation, setIsAwaitingSubmissionConfirmation] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);

  useEffect(() => {
    if (messages.length === 1) {
      setTimeout(() => {
        setMessages(prev => [...prev, { text: questions[0].prompt, sender: 'bot' }]);
      }, 600);
    }
  }, [messages.length]);

  const askNext = (nextStep, newFirData) => {
    if (nextStep < questions.length) {
      setMessages(prev => [
        ...prev,
        { text: questions[nextStep].prompt, sender: 'bot' }
      ]);
      setStep(nextStep);
    } else {
      classifyCrime(newFirData.description, newFirData);
    }
  };

  const classifyCrime = async (description, newFirData) => {
    setMessages(prev => [
      ...prev,
      { text: "Analyzing the crime type...", sender: 'bot' }
    ]);
    try {
      const res = await fetch('http://localhost:5000/api/classify-crime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: description }),
      });
      const data = await res.json();
      const crimeType = data.crimeType || 'other';

      setFirData(fir => ({ ...fir, crimeType }));
      setMessages(prev => [
        ...prev,
        { text: `The AI classified this as \"${crimeType}\". Type 'yes' to confirm or enter the correct crime type.`, sender: 'bot' }
      ]);
      setAwaitingCrimeConfirmation(true);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { text: "Sorry, I couldn't classify the crime. Please try again.", sender: 'bot' }
      ]);
    }
  };

  const handleCrimeConfirmation = async (userInput) => {
    const confirmedCrimeType =
      userInput.toLowerCase() === 'yes' ? firData.crimeType : userInput;

    setFirData(fir => ({ ...fir, crimeType: confirmedCrimeType }));
    setAwaitingCrimeConfirmation(false);

    setMessages(prev => [
      ...prev,
      { text: "Do you want to submit the complaint now? (yes/no)", sender: 'bot' }
    ]);
    setIsAwaitingSubmissionConfirmation(true);
  };

  const handleSubmissionConfirmation = async (userInput) => {
    if (userInput.toLowerCase() === 'yes') {
      await submitComplaint(firData, mediaFile);
    } else {
      setMessages(prev => [...prev, { text: "Complaint submission cancelled.", sender: 'bot' }]);
    }
    setIsAwaitingSubmissionConfirmation(false);
  };

  const submitComplaint = async (complaint, file) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Construct the complaint JSON payload
      const complaintPayload = {
        complainant: {
          fullName: complaint.name,
          email: complaint.email,
          phoneNumber: complaint.phone,
          address: {
            street: complaint.address
          }
        },
        crimeType: {
          mainCategory: complaint.crimeType
        },
        incidentDetails: {
          date: complaint.incidentDate,
          location: {
            address: complaint.incidentLocation
          },
          description: complaint.description
        }
      };
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      formData.append('complaintData', JSON.stringify(complaintPayload));
      if (file) formData.append('evidence', file); // optional

      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          // Note: Don't set Content-Type header when sending FormData; browser sets it automatically
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setMessages(prev => [
          ...prev,
          { text: `Complaint submitted successfully! Please check your email for updates.`, sender: 'bot' }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { text: `Failed to submit complaint: ${data.error || 'Unknown error'}`, sender: 'bot' }
        ]);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setMessages(prev => [
        ...prev,
        { text: "Error submitting complaint. Please try again later.", sender: 'bot' }
      ]);
    }
    setIsSubmitting(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isSubmitting) return;

    setMessages(prev => [...prev, { text: input, sender: 'user' }]);

    if (awaitingCrimeConfirmation) {
      await handleCrimeConfirmation(input.trim());
      setInput('');
      return;
    }

    if (isAwaitingSubmissionConfirmation) {
      await handleSubmissionConfirmation(input.trim());
      setInput('');
      return;
    }

    const currentKey = questions[step]?.key;
    const newFirData = { ...firData, [currentKey]: input };
    setFirData(newFirData);
    setInput('');
    askNext(step + 1, newFirData);
  };

  return (
    <div className="chatbot-popup">
      <div style={{ textAlign: 'right', padding: '8px' }}>
        <button onClick={onClose} style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px'
        }}>✖</button>
      </div>
      <div className="chatbox">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={isSubmitting ? "Submitting..." : "Type your answer..."}
          disabled={isSubmitting}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={e => setMediaFile(e.target.files[0])}
          disabled={isSubmitting}
        />
        <button onClick={sendMessage} disabled={isSubmitting}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
