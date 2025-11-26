import { useState } from "react";

const emailChecking = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const useForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailTouch, setEmailTouch] = useState(false);
    const [passwordTouch, setPasswordTouch] = useState(false);

    const isEmailValid = emailChecking.test(email);
    const showEmailErrorMessage = (emailTouch && !isEmailValid);

    const isPasswordValid = password.length >= 8;
    const showPasswordErrorMessage = passwordTouch && !isPasswordValid;
    
    return {
        email,
        setEmail,
        password,
        setPassword,
        setEmailTouch,
        setPasswordTouch,
        isEmailValid,
        showEmailErrorMessage,
        isPasswordValid,
        showPasswordErrorMessage,
    };
}

export default useForm
