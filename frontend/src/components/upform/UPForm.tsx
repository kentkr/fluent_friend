import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UPForm.css"
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import { useAuth } from "../authprovider/AuthProvider";

function UPForm({ method, redirect }: { method: any, redirect: string }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [attemptLogin, setAttemptLogin] = useState<boolean>(false)
  const navigate = useNavigate();
  const { login, register, loading, loggedIn } = useAuth()

  const name = method === "login" ? "Login" : "Register";

  useEffect(() => {
    if (loggedIn) {
      navigate(redirect)
    }
  }, [loggedIn])

  const handleSubmit = async (e: any) => {
    setAttemptLogin(true)
    e.preventDefault();

    if (method === "login") {
      login(username, password)
    } else {
      register(username, password)
      navigate(redirect)
    }
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
      {attemptLogin && <LoadingIndicator />}
      <button className="form-button" type="submit">
        {name}
      </button>
    </form>
  );
}

export default UPForm
