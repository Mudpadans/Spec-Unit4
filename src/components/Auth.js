import { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../store/authContext";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(true);
  const { dispatch } = useContext(AuthContext);

  const submitHandler = (e) => {
    e.preventDefault();
    let body = { username, password };
    axios
    .post(register ? "/register" : "/login", body)
    .then((res) => {
      dispatch({ type: "LOGIN", payload: res.data });
    })
    .catch((err) => {
      console.error(err);
    });
    console.log("submitHandler called");
  };

  return (
    <main>
      <h1>Welcome!</h1>
      <form className="form auth-form" onSubmit={submitHandler}>
        {/* username */}
        <input 
          className="form-input" 
          type="text"
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        {/* password */}
        <input 
          className="form-input" 
          type="password"
          placeholder="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button 
          className="form-btn">
            {register ? "Sign Up" : "Login"}
        </button>
      </form>
      <button className="form-btn" onClick={() => setRegister(!register)}>
        Need to {register ? "Login" : "Sign Up"}?
      </button>
    </main>
  );
};

export default Auth;
