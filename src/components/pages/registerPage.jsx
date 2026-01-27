const Register = () => {
  return (
    <div className="register">
      <div className="register-left">
        <h1 className="logo"> SEARCHERA</h1>

        <h2 className="sub-header">Get Started Now</h2>

        <form>
        <div className="form-group">
            <label>Name</label>
            <input type="text" placeholder="Enter your name" />
        </div>

        <div className="form-group">
            <label>Email address</label>
            <input type="text" placeholder="Enter your email" />
        </div>

        <div className="form-group">
            <label>Password</label>
            <input type="text" placeholder="Enter your password" />
        </div>

        <div className="form-options">
            <label>
                <input type="checkbox"/>
                I agree to the <span>terms & policy</span>
            </label>
        </div>

        <button type="submit">Register</button>
        </form>

        <div className="divider">Or</div>

        <div className="social-buttons">
            <button>Sign in with Google</button>
            <button>Sign in with LinkedIN</button>
        </div>

        <p className="signin-link">Have an account? <span>Sign In</span></p>
      </div>

      <div className="register-right">
        <img src="src\assets\images\72be0103c7bc9699eb45bcda9cc0d1c0fd2b75fa.jpg" alt="Abstract Register Page Art" />
      </div>
    </div>
  );
};

export default Register;