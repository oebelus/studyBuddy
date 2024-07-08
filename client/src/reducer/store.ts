import { User } from "../types/User"
import { getTheme } from "../utils/theme"

type AppState = {
    user: User,
    theme: string
}

const user = localStorage.getItem('userInfo')
? JSON.parse(localStorage.getItem('userInfo')!).user
: "null"

const theme = localStorage.getItem('theme')
? localStorage.getItem('theme')!
: getTheme()

export const initialState: AppState = {
    user: user ? user : "null",
    theme: theme ? theme : "light"
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
            return { ...state }
        case 'CHANGE_THEME':
            console.log(action.payload);
            localStorage.setItem('theme', action.payload)
            return { ...state, theme: action.payload }
        default:
            return state
    }
}