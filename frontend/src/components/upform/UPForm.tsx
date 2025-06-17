import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UPForm.css"
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import { useAuth } from "../authprovider/AuthProvider";

const sanitizeRedirect = (relativeUrl: string): string  => {
  // only allow relative paths right now
  if (relativeUrl.startsWith('/') && !relativeUrl.startsWith('//')) {
    return relativeUrl
  }

  alert('The url contains an invalid redirect. It may be malicious.')
  return '/'
}

function UPForm({ method, redirect }: { method: any, redirect: string }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [attemptLogin, setAttemptLogin] = useState<boolean>(false)
  const navigate = useNavigate();
  const { login, register, loggedIn } = useAuth()

  const name = method === "login" ? "Login" : "Register";
  const sanitizedRedirect = useMemo(() => {
    return sanitizeRedirect(redirect)
  }, [redirect])

  useEffect(() => {
    if (loggedIn) {
      navigate(sanitizedRedirect)
    }
  }, [loggedIn])

  const handleSubmit = async (e: any) => {
    setAttemptLogin(true)
    e.preventDefault();

    if (method === "login") {
      login(username, password)
    } else {
      register(username, password)
      navigate(sanitizedRedirect)
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
      {method === 'login' && (
        <p>
          Not registered? <a href="/register" className="register-link">Click here</a>
        </p>
      )}
    </form>
  );
}

export default UPForm
