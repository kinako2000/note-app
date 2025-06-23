import { useState } from "react";
import { supabase } from "../utils/supabase"; // Adjust the import path as necessary
import { useMutation } from "@tanstack/react-query";

export const useMutateAuth = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const reset = () => {
    setEmail('');
    setPassword('');
};

const loginMutation = useMutation({
    mutationFn: async () => {
    console.log("Trying login with:", email, password)
    const { error } = await supabase.auth.signIn({ email:email.trim(), password });
    if (error) throw new Error(error.message);},
    onError: (error: Error) => {
    alert(error.message);
    reset();
    }
});

const registerMutation = useMutation({
    mutationFn: async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    },
    onError: (error: Error) => {
    alert(error.message);
    reset();
    }
});

return {
    email,
    setEmail,
    password,
    setPassword,
    loginMutation,
    registerMutation
};
};
