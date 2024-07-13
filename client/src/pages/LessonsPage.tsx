import { useState } from 'react'
import LargeSidebar from '../components/lessons/LargeSidebar'
import Lessons from '../components/lessons/Lessons'

export default function LessonsPage() {
    const [clicked, setClicked] = useState('')
    
    return (
        <div className='h-screen flex'>
            <LargeSidebar clicked={clicked} setClicked={setClicked} />
            {clicked !== '' &&
                <Lessons clicked={clicked}/>
            }
        </div>
    )
}
