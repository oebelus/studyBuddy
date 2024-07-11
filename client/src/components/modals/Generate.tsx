import Modal from 'react-modal';
import { customStyles } from './modalUtils/styles';

interface GenerateType {
    setClicked: (el:string) => void;
    modalIsOpen: boolean;
    setIsOpen: (el:boolean) => void;
    titles: string[]
}

export default function Generate({modalIsOpen, setIsOpen, setClicked, titles}: GenerateType) {
    function closeModal() {
        setIsOpen(false);
        setClicked("")
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
            <div className="mx-auto max-w-[95%] bg-white w-fit h-fit p-3 rounded-lg mt-4">
                <div className="lg:flex lg:justify-between lg:items-center">
                <div className="flex flex-row gap-4">
                <p className="text-black font-semibold text-3xl">Generate:</p>
                </div>
                <label htmlFor="">Choose a lesson:</label>
                <select value="Choose an existing topic">
                    {titles && titles.length > 0 && titles.map((title, key) => (
                    <option key={key} value={title}>
                        {title}
                    </option>
                    ))}
                </select>
                {/* <div className="flex flex-col mt-6 lg:mt-1 gap-2">
                    <input required value={title} onChange={(e) => setTitle(e.target.value)} className="shadow p-2 rounded-lg" placeholder="Lesson Name" type="text" name="module" id="module" />
                </div> */}
                </div>
                {/* <div className="flex justify-center gap-4">
                    <button onClick={addLesson} type="button" className=" border-zinc-300 border-2 mt-4 px-5 py-3 font-semibold text-zinc-900 rounded bg-white hover:bg-zinc-200 transition">Add</button>
                </div> */}
            </div>
        </Modal>
    )
}
