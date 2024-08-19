import { jwtDecode } from "jwt-decode";
import { User } from "../types/User"
import { getTheme } from "../utils/theme"

type AppState = {
    user: User | null,
    theme: string,
    titles: string[]
}

const user = localStorage.getItem('token')
? jwtDecode(localStorage.getItem('token')!)
: null

const theme = localStorage.getItem('theme')
? localStorage.getItem('theme')!
: getTheme()

export const initialState: AppState = {
    user: user ? user as User : null,
    theme: theme ? theme : "light",
    titles: []
}

export type Action = 
    | { type: 'USER_SIGNIN'; payload: User }
    | { type: 'USER_SIGNOUT' }
    | { type: 'CHANGE_THEME', payload: string }

export function reducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'USER_SIGNIN': 
            return { ...state, user: action.payload };
        case 'USER_SIGNOUT': 
            localStorage.removeItem('token');
            return { ...state, user: null }
        case 'CHANGE_THEME':
            localStorage.setItem('theme', action.payload)
            return { ...state, theme: action.payload }
        default:
            return state
    }
}