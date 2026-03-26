import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <section className="bg-primary text-white py-16">
        <div className="container text-center">
          <h1 className="text-3xl font-bold mb-4">Pusatospek</h1>
          <p className="text-xl mb-8">Your ultimate student orientation ordering and referral management platform.</p>
          <Link to="/order" className="btn btn-secondary text-lg">Order Now</Link>
        </div>
      </section>
      
      <section className="container py-16">
        <h2 className="text-2xl text-center mb-8">How it Works</h2>
        <div className="grid grid-cols-1 md-grid-cols-3 gap-8">
          <div className="card text-center">
            <h3 className="font-bold mb-2">1. Get Referral</h3>
            <p>Receive a code from our sales team</p>
          </div>
          <div className="card text-center">
            <h3 className="font-bold mb-2">2. Place Order</h3>
            <p>Choose your orientation package</p>
          </div>
          <div className="card text-center">
            <h3 className="font-bold mb-2">3. Pick Up</h3>
            <p>Get your package at designated points</p>
          </div>
        </div>
      </section>

      <section className="container py-8 text-center bg-surface">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="mb-4">Need help? Contact our support team for any ospek needs inquiries.</p>
        <Link to="/contact" className="btn btn-outline">Contact Support</Link>
      </section>
    </div>
  );
};

export default HomePage;
