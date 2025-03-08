import { writable } from 'svelte/store';
import { auth } from '$lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const user = writable(null);
export const isAdmin = writable(false);

onAuthStateChanged(auth, (currentUser) => {
    user.set(currentUser);
    if (currentUser) {
        // Check if the user is admin based on email
        isAdmin.set(currentUser.email === 'admin@gmail.com'); // Updated to match your admin email
    } else {
        isAdmin.set(false);
    }
});