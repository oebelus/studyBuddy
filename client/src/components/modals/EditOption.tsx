import { FC } from 'react';

interface EditOptionProps {
    editingOption: { index: number; text: string; isCorrect: boolean };
    setEditingOption: (option: { index: number; text: string; isCorrect: boolean } | null) => void;
    onClose: () => void;
    onSave: () => void;
}

export const EditOption: FC<EditOptionProps> = ({ 
    editingOption, 
    setEditingOption,
    onClose, 
    onSave, 
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">Edit Option</h2>
                <input
                    type="text"
                    value={editingOption.text}
                    onChange={(e) => setEditingOption({ ...editingOption, text: e.target.value })}
                    className="w-full p-2 border rounded-lg mb-4"
                />
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={editingOption.isCorrect}
                        onChange={(e) => setEditingOption({ ...editingOption, isCorrect: e.target.checked })}
                    />
                    Correct
                </label>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={onSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};