import { firebaseConfig } from './firebase.js'
import {
    connectStorageEmulator,
    deleteObject, getDownloadURL, getMetadata, getStorage, listAll, ref, uploadBytes, uploadBytesResumable,
    uploadString
} from "firebase/storage";
import { initializeApp } from 'firebase/app'
import fs from 'fs'


initializeApp(firebaseConfig);
const storage = getStorage();

export async function uploadFile(file1,file2) {
    try {
        // Create references for the files in Firebase Storage
        // console.log('upload start');
        const storageRef = ref(storage,`books/images/${file1.filename}`)
        const storageRef2 = ref(storage,`books/files/${file2.filename}`)
        const fileBuffer1 =  fs.readFileSync(file1.path);
        const fileBuffer2 =  fs.readFileSync(file2.path);
        const metadata = {
            contentType:file1.mimetype
        }
        const metadata2 = {
            contentType:file2.mimetype
        }
        // console.log(storageRef)
        // console.log(metadata)
        const snap = await uploadBytesResumable(storageRef,fileBuffer1,metadata);
        const snap2 = await uploadBytesResumable(storageRef2,fileBuffer2,metadata2);
        // console.log("uploaded succss");
        const imageDownloadURL = await getDownloadURL(snap.ref);
        const bookDownloadURL = await getDownloadURL(snap2.ref);
        // console.log(imageDownloadURL)
        // console.log(bookDownloadURL);
        return {
            success: true,
            imageDownloadURL,
            bookDownloadURL
        };
    } catch (error) {
        console.error('Error uploading files:', error);
        return { success: false, error }; // Return error information
    }
}


export async function getDownloadUrlPath(cloudPath) {
    return await getDownloadURL(ref(storage, cloudPath));
}
export function getDownloadUrlPathUsingManulMaking(cloudPath, alt) {
    const encodedPath = encodeURIComponent(cloudPath);
    const url = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${encodedPath}?alt=${alt || 'media'}`;
    return url;
}

export async function deleteFile(cloudPath) {
    try {
        const storageRef = ref(storage, cloudPath);
        const temp = await deleteObject(storageRef)
        return { ok: true };
    } catch (e) {
        return { ok: false, msg: e.message, error: e };
    }
}
