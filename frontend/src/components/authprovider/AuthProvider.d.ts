
export interface AuthContextType {
    loggedIn: boolean
    loading: boolean
    login: () => void
    logout: () => void
    checkLoginStatus: () => void
}

