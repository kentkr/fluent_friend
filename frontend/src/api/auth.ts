
import { jwtDecode } from "jwt-decode";
import api from "./api-client";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { Creds, UserTokens } from "../types/api";

export async function isLoggedIn(): Promise<boolean> {
  const token = localStorage.getItem(ACCESS_TOKEN)
  if (!token) {
    return false
  }
  const decoded = jwtDecode(token);
  const tokenExpiration = decoded.exp;
  const now = Date.now() / 1000;

  // if token is old try to refresh
  if (tokenExpiration && tokenExpiration < now) {
    const wasRefreshed = await refreshToken()
    return wasRefreshed
  } else {
    return true
  }
}

export async function loginOrRegister(route: string, creds: Creds): Promise<UserTokens> {
  const tokens = await api.post(route, creds)
    .then((res) => res.data )
    .catch((err) => alert(err))
  return tokens
}

async function refreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN); 
  const isAuthorized = await api.post("/api/token/refresh/", {
    refresh: refreshToken,
  })
    .then((res) => {
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access)
        return true
      } else {
        return false
      }
    })
    .catch((err) => {
      alert(err)
      return false
    })
  return isAuthorized
}
