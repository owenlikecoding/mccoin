"use client";

import { useEffect, useState } from "react";
import { getDatabase, ref, get, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import Cookies from "js-cookie";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBXn34NBurMAMvApEOTrASF_JxEm5dEkDY",
    authDomain: "owen-bucks-evolved.firebaseapp.com",
    databaseURL: "https://owen-bucks-evolved-default-rtdb.firebaseio.com",
    projectId: "owen-bucks-evolved",
    storageBucket: "owen-bucks-evolved.appspot.com",
    messagingSenderId: "78917635267",
    appId: "1:78917635267:web:e5aa6f89987f9e38326676",
    measurementId: "G-JG7NGCN5P1",
};

interface User {
    uid: string;
    balance: number;
    name: string;
    email: string;
    [key: string]: string | number;
}

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function Admin() {
    const [users, setUsers] = useState<User[]>([]);
    const [uid, setUid] = useState('');
    const [editingUserIndex, setEditingUserIndex] = useState<number | null>(null);
    const [editingUser, setEditingUser] = useState<Partial<User>>({});

    useEffect(() => {
        const uidCookie = Cookies.get('uid');
        if (uidCookie && uidCookie === 'l9k2FHAlGwPfEVJlInMGanVN7hL2' || uidCookie === 'JWihxFJfoPNUWGlFgoGAgZ0wfyu1') {
            setUid(uidCookie);
            get(ref(db, "users/")).then((snapshot) => {
                if (snapshot.exists()) {
                    setUsers(Object.values(snapshot.val()));
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
        } else {
            console.log("Access denied");
        }
    }, []);

    const handleUpdate = (index: number) => {
        setEditingUserIndex(index);
        setEditingUser(users[index]);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setEditingUser({ ...editingUser, [name]: value });
    };

    const handleSave = () => {
        if (editingUserIndex !== null) {
            const updatedUsers = [...users];
            updatedUsers[editingUserIndex] = {
                ...updatedUsers[editingUserIndex],
                ...Object.fromEntries(Object.entries(editingUser).filter(([key, value]) => value !== undefined)) as User
            };
            setUsers(updatedUsers);
    
            // Use the uid from the editingUser state
            const userUid = editingUser.uid;
            console.log("User UID: ", userUid);
            if (userUid) {
                const userRef = ref(db, `users/${userUid}`);
                // Directly update the user's data under the users/[uid] path
                set(userRef, updatedUsers[editingUserIndex]).then(() => {
                    console.log("User updated successfully");
                }).catch((error) => {
                    console.error("Error updating user: ", error);
                });
    
                setEditingUserIndex(null);
                setEditingUser({});
            } else {
                console.log("User UID not found");
                
            }
        }
    };

    return (
        <div className="p-4">
            {uid && (
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Balance</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.uid} className="border-t border-gray-200">
                                <td className="border px-4 py-2">
                                    {editingUserIndex === index ? (
                                        <input
                                            type="number"
                                            name="balance"
                                            value={editingUser.balance || ''}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        user.balance
                                    )}
                                </td>
                                <td className="border px-4 py-2">
                                    {editingUserIndex === index ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={editingUser.name || ''}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        user.name
                                    )}
                                </td>
                                <td className="border px-4 py-2">
                                    {editingUserIndex === index ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={editingUser.email || ''}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td className="border px-4 py-2">
                                    {editingUserIndex === index ? (
                                        <button onClick={handleSave}>Save</button>
                                    ) : (
                                        <button onClick={() => handleUpdate(index)}>Edit</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}