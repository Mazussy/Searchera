import React from "react";

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-left">
        <h1 className="logo">SEARCHERA</h1>

        <h2 className="sub-header">Welcome back!</h2>

        <form>
          <div className="form-group">
            <label>Email address</label>
            <input type="email" placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" />
          </div>
          <div className="form-options">
            <label>
              <input type="checkbox" />
              Remember for 30 days
            </label>
            <a href="#">forgot password</a>
          </div>
          <button type="submit">Login</button>
          </form>

        <div className="divider">Or</div>

        <div className="social-buttons">
          <button>Sign in with Google</button>
          <button>Sign in with Apple</button>
        </div>

        <p className="signin-link">Don't have an account? <span>Sign Up</span></p>
      </div>

      <div className="login-right">
        <img src="/path-to-your-image.jpg" alt="Decorative" />
      </div>
    </div>
  );
};

export default LoginPage;
