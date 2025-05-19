import { Modal } from "@mui/material";
interface DeleteQuestionProps {
    del: boolean;
    setDel: (e: boolean) => void,
    n: number
    handleDeleteQuestion: () => Promise<void>
    setCanMove: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DeleteQuestion({del, setDel,  n, handleDeleteQuestion, setCanMove}: DeleteQuestionProps) {
    const onCancel = () => {
        setDel(false);
        setCanMove(true);
    };

    return (
        <Modal
            open={del}
            onClose={() => setDel(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md bg-white dark:bg-[#111111] dark:text-gray-100">
                    <h2 className="text-xl font-semibold leading-tight tracking-tight text-center">Delete Question {n}</h2>
                    <p className="flex-1 text-center dark:text-gray-400">Are you sure that you want to delete this question?
                    </p>
                    <div className="flex justify-center gap-3 mt-6 sm:mt-8 sm:flex-row">
                        <button onClick={onCancel} className="px-6 py-2 rounded-sm">Cancel</button>
                        <button onClick={handleDeleteQuestion} className="px-6 py-2 rounded-sm shadow-sm bg-yellow-100 dark:bg-[#1F1F1F] dark:text-white">Confirm</button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
