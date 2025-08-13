import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Home() {
  return (
    <>
      <main className="hero">
        <div className="hero-content">
          <h1>Welcome to Paws Home!</h1>
          <p>
            Paws Home is a Chicago-based animal shelter dedicated to rescuing and rehoming pets in need.
            Join our mission by becoming a volunteer today!
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="btn-primary">Log In</Link>
            <Link to="/handbook" className="btn-secondary">Volunteer Handbook</Link>
          </div>
          <div className="signup-link">
            Don't have an account? <Link to="/register" className="signup-text">Sign up here</Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;
// import React from 'react';
// import { Link } from 'react-router-dom';
// import '../App.css';

// function Home() {
//   return (
//     <>
//       <main className="hero">
//         <div className="hero-content">
//           <h1>Welcome!<br />Paws Home Volunteers</h1>
//           <p>
//             Paws Home is a Chicago-based animal shelter dedicated to rescuing and rehoming pets in need.
//             Join our mission by becoming a volunteer today!
//           </p>
//           <div className="hero-buttons">
//             <div className="buttons-row">
//               <Link to="/register" className="btn-primary">Sign Up</Link>
//               <Link to="/login" className="btn-primary">Log In</Link>
//             </div>
//             <Link to="/handbook" className="btn-secondary">Volunteer Handbook</Link>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }

// export default Home;