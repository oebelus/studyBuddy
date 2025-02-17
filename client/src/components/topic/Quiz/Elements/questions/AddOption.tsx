import { FC, Dispatch, SetStateAction } from 'react';
import { AddingOption } from '../../../../../types/mcq';

interface AddOptionModalProps {
    addingOption: AddingOption;
    onClose: () => void;
    onSave: () => void;
    setAddingOption: Dispatch<SetStateAction<AddingOption | null>>;
}

export const AddOptionModal: FC<AddOptionModalProps> = ({
    addingOption,
    onClose,
    onSave,
    setAddingOption
}) => {
    const handleTextChange = (text: string) => {
        setAddingOption(prev => prev ? { ...prev, text } : null);
    };

    const handleCorrectChange = (isCorrect: boolean) => {
        setAddingOption(prev => prev ? { ...prev, isCorrect } : null);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">Add New Option</h2>
                <input
                    type="text"
                    value={addingOption.text}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder="Enter option text"
                    className="w-full p-2 border rounded-lg mb-4"
                />
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={addingOption.isCorrect}
                        onChange={(e) => handleCorrectChange(e.target.checked)}
                    />
                    Is Correct
                </label>
                <div className="flex justify-end gap-2 mt-4">
                    <button 
                        onClick={onClose}
                        className="bg-gray-300 px-4 py-2 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        disabled={!addingOption.text.trim()}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};