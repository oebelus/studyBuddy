import { useEffect, useReducer, useState } from 'react'
import LargeSidebar from '../components/lessons/LargeSidebar'
import Lessons from '../components/lessons/Lessons'
import { initialState, reducer } from '../reducer/store'
import axios from 'axios'

export default function LessonsPage() {
    const [clicked, setClicked] = useState('')
    const [state, dispatch] = useReducer(reducer, initialState)
    const [lessons, setLessons] = useState<string[]>([])

    useEffect(() => {
        const token = JSON.stringify(localStorage.getItem('token')!.trim());
        
        axios.get("http://localhost:3000/api/users", { 
            headers: {"Authorization" : `Bearer ${token.trim().slice(1, token.length - 1)}`} 
        })
        .then((response) => {
            dispatch({type: 'SET_TITLES', payload: response.data.user.titles})
            console.log(state.titles);
            
            setLessons(response.data.user.titles)
        })
        .catch((err) => console.log(err.message))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return (
        <div className='h-screen flex'>
            <LargeSidebar clicked={clicked} setClicked={setClicked} lessons={lessons} />
            {clicked !== '' &&
                <Lessons lessons={lessons} clicked={clicked}/>
            }
        </div>
    )
}
