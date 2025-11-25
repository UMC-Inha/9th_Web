import { useState, type ChangeEvent } from "react";

interface LpModalProps{
    isOpen: boolean;
    onClose: () => void;
}

const LpModal = ({isOpen, onClose}: LpModalProps) => {
    const [selectFile, setSelectFile] = useState<File | null>(null);

    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    const handleFile = (e: ChangeEvent<HTMLInputElement>) =>{
        if(e.target.files && e.target.files[0]) {
            setSelectFile(e.target.files[0]);
        }
    }

    const handleTagInput = (e: ChangeEvent<HTMLInputElement>) =>{
        setTagInput(e.target.value);
    }

    const handleAddTag = () => {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
    }

    const handleRemoveTag = (tagRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagRemove));
    }

    if(!isOpen){
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
        onClick={() => onClose()}>
          <div className="bg-blue-300 text-white p-6 rounded-lg shadow-xl max-w-sm relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onClose()}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl cursor-pointer"
            >
              X
            </button>

            <label className="cursor-pointer mb-6" htmlFor="lp-image">
              {selectFile ? (
                <img src={URL.createObjectURL(selectFile)} className="mb-6"/>
              ) : (
              <div className="flex flex-col items-center pt-4">
                <div className="w-32 h-32 bg-black rounded-full flex items-center justify-center border-4 border-yellow-200 mb-6">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center"></div>
                </div>
              </div>)}
            </label>

            <input id="lp-image" type="file" onChange={handleFile} className="hidden"/>

            <form className="w-full">
              <div className="mb-4">
                <input
                    type="text"
                    placeholder="LP Name"
                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  />
              </div>

              <div className="mb-4">
                  <input
                    type="text"
                    placeholder="LP Content"
                    className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  />
                </div>

                <div className="mb-6 flex gap-2">
                  <input
                    type="text"
                    placeholder="LP Tag"
                    value={tagInput}
                    onChange={handleTagInput}
                    className="flex-grow p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {tags.map((tag) => (
                    <div className="bg-gray-800 text-white rounded-full px-3 py-1 text-sm flex items-center gap-2">
                        <span>{tag}</span>
                    <button type="button" onClick={() => handleRemoveTag(tag)}
                            className="text-gray-400 hover:text-white font-bold text-xs cursor-pointer">X</button>
                    </div>))}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 cursor-pointer"
                >
                  Add LP
                </button>
            </form>
          </div>
        </div>
    )
}

export default LpModal