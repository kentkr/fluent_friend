
export interface AuthContextType {
    loggedIn: boolean
    loading: boolean
    login: (email: string, password: string) => Promise<void> = async (email, password)
    logout: () => void
    checkLoginStatus: () => void
    register: (email: string, password: string) => void
}

