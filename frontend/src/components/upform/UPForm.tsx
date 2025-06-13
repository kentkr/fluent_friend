import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import "./UPForm.css"
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import { loginOrRegister } from "../../api/auth";

function UPForm({ route, method }: { route: any; method: any }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e: any) => {
    setLoading(true);
    e.preventDefault();

    let userTokens = await loginOrRegister(route, { username, password })
    if (method === "login") {
      localStorage.setItem(ACCESS_TOKEN, userTokens.access);
      localStorage.setItem(REFRESH_TOKEN, userTokens.refresh);
      navigate('/')
    } else {
      navigate('/login')
    }
    setLoading(false)
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        />
      {loading && <LoadingIndicator />}
      <button className="form-button" type="submit">
        {name}
      </button>
    </form>
  );
}

export default UPForm
