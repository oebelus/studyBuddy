import { Modal } from "@mui/material";
import axios from "axios";

interface DeleteTopicProps {
    del: boolean;
    setDel: (e: boolean) => void,
    topicId: string
}

export default function DeleteTopic({del, topicId, setDel}: DeleteTopicProps) {
    const handleDelete = () => {
        const token = localStorage.getItem("token");
        
        axios.delete(`http://localhost:3000/api/quiz/flashcard/${topicId}`,
            {
            headers: {
                Authorization: `Bearer ${token}` // Add the token to headers
            }
        }
        )
        .then(() => {
            console.log("Topic Deleted Successfully!")
            setDel(false);
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
                    <p className="flex-1 text-center dark:text-gray-400">Are you sure that you want to delete this topic?
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
