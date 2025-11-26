import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaTimes } from 'react-icons/fa';
import { postLps } from '../apis/lps';
import { postImage } from '../apis/uploads';

const LpCreatedModal = ({ isOpen, onClose }) => {
    const queryClient = useQueryClient();
    
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        thumbnail: '',
        published: true
    });
    
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const fileInputRef = useRef(null);

    const { mutate } = useMutation({
        mutationFn: postLps,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lps'] });
            alert('LP가 성공적으로 생성되었습니다.');
            onClose();
        },
        onError: (error) => {
            console.error(error);
            alert(error.response?.data?.message || '생성 중 오류가 발생했습니다.');
        }
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e: { target: { files: any[]; }; }) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const imageUrl = await postImage(file);
            setFormData(prev => ({
                ...prev,
                thumbnail: imageUrl
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() !== '') {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (indexToRemove: number) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = () => {
        if (!formData.title.trim() || !formData.content.trim()) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        const requestBody = {
            ...formData,
            tags: tags
        };
        
        mutate(requestBody);
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
            <div className='relative w-[400px] bg-[#2C2C35] rounded-2xl p-6 shadow-2xl flex flex-col items-center'>
                <button 
                    onClick={onClose}
                    className='absolute top-4 right-4 text-gray-400 hover:text-white transition-colors'
                >
                    <FaTimes size={18} />
                </button>

                <div 
                    onClick={handleImageClick}
                    className='mt-2 mb-6 w-40 h-40 rounded-full overflow-hidden shadow-lg animate-[spin_10s_linear_infinite] cursor-pointer hover:opacity-80 transition-opacity relative group'
                >
                    <img 
                        src={formData.thumbnail}
                        alt="Vinyl" 
                        className='w-full h-full object-cover'
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all">
                        <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-bold">Change</span>
                    </div>
                </div>

                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                <div className='w-full space-y-3'>
                    <input 
                        type="text" 
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="LP Name"
                        className='w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors text-sm'
                    />
                    
                    <input 
                        type="text" 
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="LP Content"
                        className='w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors text-sm'
                    />

                    <div className='flex gap-2'>
                        <input 
                            type="text" 
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                            placeholder="LP Tag"
                            className='flex-1 bg-transparent border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors text-sm'
                        />
                        <button 
                            onClick={handleAddTag}
                            className='bg-gray-400 hover:bg-gray-300 text-[#2C2C35] font-bold rounded-lg px-4 text-sm transition-colors'
                        >
                            Add
                        </button>
                    </div>

                    {tags.length > 0 && (
                        <div className='flex flex-wrap gap-2 mt-2 max-h-24 overflow-y-auto'>
                            {tags.map((tag, index) => (
                                <div key={index} className='flex items-center bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-xs'>
                                    <span className='mr-2'>#{tag}</span>
                                    <button 
                                        onClick={() => handleRemoveTag(index)}
                                        className='hover:text-pink-500 focus:outline-none'
                                    >
                                        <FaTimes size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button 
                        onClick={handleSubmit}
                        className='w-full mt-4 bg-[#9CA3AF] hover:bg-gray-300 text-[#2C2C35] font-bold py-3 rounded-xl transition-colors shadow-md'
                    >
                        Add LP
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LpCreatedModal;