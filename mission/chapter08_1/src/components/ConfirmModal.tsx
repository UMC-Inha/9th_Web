import React from 'react';
import { createPortal } from 'react-dom'; // React Portal을 임포트합니다.

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: React.ReactNode;
    isPending?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    children,
    isPending = false,
    }) => {
    if (!isOpen) {
        return null;
    }

    // createPortal을 사용하여 모달을 document.body에 직접 렌더링합니다.
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <div className="bg-black border border-pink-500 rounded-lg p-6 w-80 shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4 text-white">{title}</h2>
            <div className="text-gray-300 mb-6">{children}</div>

            <div className="flex justify-center gap-4">
            <button
                onClick={onClose}
                disabled={isPending}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition disabled:opacity-50"
            >
                취소
            </button>
            <button
                onClick={onConfirm}
                disabled={isPending}
                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition disabled:bg-pink-800"
            >
                {isPending ? '처리 중...' : '예'}
            </button>
            </div>
        </div>
        </div>,
        document.body 
    );
};

export default ConfirmModal;