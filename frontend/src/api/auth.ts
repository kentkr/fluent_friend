
import { jwtDecode } from "jwt-decode";
import api from "./api-client";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { Creds, UserTokens } from "../types/api";
import axios, {AxiosError} from "axios";

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
    if (!wasRefreshed) {
      localStorage.clear()
    }
    return wasRefreshed
  } else {
    return true
  }
}

export async function loginOrRegister(route: string, creds: Creds): Promise<boolean> {
  try {
    const res = await api.post(route, creds) 
    const tokens = res.data
    localStorage.setItem(ACCESS_TOKEN, tokens.access);
    localStorage.setItem(REFRESH_TOKEN, tokens.refresh);
    return true
  } catch (err: any | AxiosError) {
    if (axios.isAxiosError(err)) {
      alert(`Status code: ${err.response?.status}, message: ${err.request?.response}`)
    } else {
      alert('Caught unexpected error.')
    }
    console.log(err)
    return false
  }
}

export async function refreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN); 
  if (!refreshToken) return false;

  try {
    const res = await api.post<UserTokens>('/api/token/refresh/', { refresh: refreshToken })
    const { access } = res.data
    localStorage.setItem(ACCESS_TOKEN, access)
    return true
  } catch (e) {
    return false
  }
}

