interface EditQuestionProps {
    editingQuestion: { index: number; text: string };
    setEditingQuestion: (option: { index: number; text: string } | null) => void;
    onClose: () => void;
    onSave: (question: string) => Promise<void>;
}

export const EditQuestion = ({ 
    editingQuestion,
    setEditingQuestion,
    onClose, 
    onSave, 
}: EditQuestionProps) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">Edit Question</h2>
                <input
                    type="text"
                    value={editingQuestion.text}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                    className="w-full p-2 border rounded-lg mb-4"
                />
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={() => onSave(editingQuestion.text)} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};