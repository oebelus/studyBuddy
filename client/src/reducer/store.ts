import { User } from "../types/User"

type AppState = {
    user: User
}

const user = localStorage.getItem('userInfo')
? JSON.parse(localStorage.getItem('userInfo')!).user
: "null"

export const initialState: AppState = {
    user: user ? user : "null",
}

export type Action = 
    | { type: 'USER_SIGNIN'; payload: User }
    | { type: 'USER_SIGNOUT' }

export function reducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'USER_SIGNIN': 
            return { ...state, user: action.payload };
        case 'USER_SIGNOUT': 
            return { ...state }
        default:
            return state
    }
}