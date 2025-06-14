
export interface AuthContextType {
    loggedIn: boolean
    loading: boolean
    login: (username: string, password: string) => Promise<void> = async (username, password)
    logout: () => void
    checkLoginStatus: () => void
    register: (username: string, password: string) => void
}

