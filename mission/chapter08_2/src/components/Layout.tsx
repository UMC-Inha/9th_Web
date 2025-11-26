import { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; 
import Footer from './Footer';
import FloatingButton from './FloatingButton';

const Layout = () => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null); 

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(e.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div className='flex flex-col min-h-screen'>
            <Navbar 
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                sidebarRef={sidebarRef}
                buttonRef={buttonRef}
            />
            <FloatingButton />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;