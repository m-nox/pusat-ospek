import { Link } from 'react-router-dom';

const ThankYouPage = () => (
  <div className="container py-16 text-center">
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 className="text-3xl font-bold text-success mb-4">Thank You!</h1>
      <p className="mb-8 text-lg">Your order has been successfully submitted. We will contact you soon via WhatsApp for confirmation.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  </div>
);

export default ThankYouPage;
