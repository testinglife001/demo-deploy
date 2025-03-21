import React, { useState } from "react";
 import "./Login.css";
//import axios from "axios";
import newRequest from "../utils/newRequest";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(username);
    // console.log(password);

    try {
        // await axios.post(`${backend_url}/user/login`,data, { withCredentials: true })
        const res = await newRequest.post("/user/login", { username, password });
         console.log(res.data);
         localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/"); 

    } catch (error) {
         setError(error.response.data);
        console.log(error);
    }

  }

  return (
    <div>
      Login

      <div>
        <div className="text-center" >
        
          <img className="mb-4" src="https://www.freeiconspng.com/uploads/blank-logo-design-for-brand-13.png" 
            alt="" width="280" height="250" />
          
          
          <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>

        <form className="form-signin"
          method="post"
           onSubmit={handleSubmit}  
          >

          <label for="inputUsername" className="sr-only">Username</label>
          <input id="inputUsername" className="form-control" 
            name="username"
            type="text"
            placeholder="john doe"
            value={username} 
             onChange = { e => setUsername(e.target.value) }
            required autofocus 
            />
          <label for="inputPassword" className="sr-only">Password</label>
          <input id="inputPassword" className="form-control" 
            name="password"
            type="password"
            placeholder="*******"
            value={password}
             onChange = { e => setPassword(e.target.value) }
            required
            />
          <div className="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me" /> Remember me
            </label>
          </div>
          <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
          <p className="text-danger" >
          { /* error && error */ }
          </p>
          <p className="mt-5 mb-3 text-muted">&copy; 2019-2020</p>
        </form>
        </div>
      </div>

    </div>
  )
}

export default Login