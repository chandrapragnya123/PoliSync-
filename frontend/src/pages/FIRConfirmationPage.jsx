import { CheckCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const FIRConfirmation = () => {
  const location = useLocation();
  const { firNumber } = location.state || {};

  return (
    <div className="confirmation-container">
      <CheckCircle size={48} color="green" />
      <h1>FIR Submitted Successfully!</h1>
      {firNumber && (
        <p>Your FIR number is: <strong>{firNumber}</strong></p>
      )}
      <p>You will receive updates on your registered email.</p>
    </div>
  );
};

export default FIRConfirmation;