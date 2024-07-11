import { useReducer, useState } from 'react';
import Modal from 'react-modal';
import axiosInstance from '../../api/instances';
import { initialState, reducer } from '../../reducer/store';
import { ModalType } from './modalUtils/modalType';
import { customStyles } from './modalUtils/styles';

export default function Create({modalIsOpen, setIsOpen}: ModalType) {
    const [title, setTitle] = useState("")
    const [, dispatch] = useReducer(reducer, initialState)

    function closeModal() {
        setIsOpen(false);
    }
    
    const addLesson = () => {
        axiosInstance.put("/users/titles", {
            title: title
        })
        .then((response) => {
            dispatch( { type: "ADD_TITLE", payload: response.data.title } )
            closeModal();
        })
        .catch((error) => console.log(error));
    }

    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <span onClick={closeModal} className="cursor-pointer material-symbols-outlined">
                close
            </span>
            <div className="mx-auto max-w-[95%] bg-white dark:bg-[#2F2F2F] w-fit h-fit p-3 rounded-lg mt-4">
                <div className="lg:flex lg:justify-between lg:items-center">
                <div className="flex flex-row gap-4">
                <p className="text-black dark:text-white font-semibold text-3xl">Add a lesson:</p>
                </div>
                <div className="flex flex-col mt-6 lg:mt-1 gap-2">
                    <input required value={title} onChange={(e) => setTitle(e.target.value)} className="shadow p-2 rounded-lg" placeholder="Lesson Name" type="text" name="module" id="module" />
                </div>
                </div>
                <div className="flex justify-center gap-4">
                    <button onClick={addLesson} type="button" className=" border-zinc-300 border-2 mt-4 px-5 py-3 font-semibold text-zinc-900 rounded bg-white hover:bg-zinc-200 transition">Add</button>
                </div>
            </div>
        </Modal>
    )
}
