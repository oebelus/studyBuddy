import { Modal } from "@mui/material";
import axios from "axios";
import { Output } from "../../types/output";
import { useReducer } from "react";
import { initialState, reducer } from "../../reducer/store";

interface DeleteTopicProps {
    del: boolean;
    setDel: (e: boolean) => void,
    topicId: string,
    type: Output
}

export default function DeleteTopic({del, topicId, type, setDel}: DeleteTopicProps) {
    const [, dispatch] = useReducer(reducer, initialState)

    const handleDelete = () => {
        console.log("deleting")
        const token = localStorage.getItem("accessToken");
        
        axios.delete(`http://localhost:3000/api/${type == 'quiz' ? 'quiz' : 'flashcard'}/${topicId}`,
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            console.log("Topic Deleted Successfully!")
            setDel(false);
            dispatch({type: "DELETE_MCQS_TOPIC", payload: topicId})
            window.location.reload()
        })
        .catch((err) => console.log(err));
    }

    return (
        <Modal
            open={del}
            onClose={() => setDel(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md bg-white dark:bg-[#111111] dark:text-gray-100">
                    <h2 className="text-xl font-semibold leading-tight tracking-tight text-center">Delete Topic</h2>
                    <p className="flex-1 text-center dark:text-gray-400">Are you sure that you want to delete this deck?
                    </p>
                    <div className="flex justify-center gap-3 mt-6 sm:mt-8 sm:flex-row">
                        <button onClick={() => setDel(false)} className="px-6 py-2 rounded-sm">Cancel</button>
                        <button onClick={handleDelete} className="px-6 py-2 rounded-sm shadow-sm bg-yellow-100 dark:bg-[#1F1F1F] dark:text-white">Confirm</button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
