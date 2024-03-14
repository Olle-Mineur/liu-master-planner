// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Firestore, getFirestore, collection, getDocs, query, where, addDoc, setDoc, DocumentReference } from 'firebase/firestore/lite';
import { env } from "process";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

/**
 * Firebase configuration object.
 */
const firebaseConfig = {
    apiKey: env.apiKey,
    authDomain: env.authDomain,
    projectId: env.projectId,
    storageBucket: env.storageBucket,
    messagingSenderId: env.messagingSenderId,
    appId: env.appId,
    measurementId: env.measurementId
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

/**
 * Retrieves all programs from the Firestore database.
 * @param db - The Firestore instance.
 * @returns A promise that resolves to an array of program objects.
 */
async function getPrograms(db: Firestore) {
    try {
        const programsCol = collection(db, 'programs');
        const programsSnapshot = await getDocs(programsCol);
        const programList = programsSnapshot.docs.map(doc => doc.data());
        return programList;
    } catch (error) {
        console.error("Error retrieving programs:", error);
        throw error;
    }
}

/**
 * Retrieves a specific program from the Firestore database.
 * @param db - The Firestore instance.
 * @param program_name - The name of the program to retrieve.
 * @param program_start - The start date of the program.
 * @returns A promise that resolves to the program object.
 */
async function getProgram(db: Firestore, program_name: string, program_start: string) {
    try {
        const programCol = collection(db, 'programs');
        const programQuery = query(programCol, where('program', '==', program_name), where('program_start', '==', program_start));
        const programSnapshot = await getDocs(programQuery);
        const programData = programSnapshot.docs.map(doc => doc.data());
        return programData;
    } catch (error) {
        console.error("Error retrieving program: " + program_name, error);
        throw error;
    }
}

/**
 * Updates a program in the Firestore database.
 * If the program does not exist, it will be added.
 * @param db - The Firestore instance.
 * @param program_name - The name of the program.
 * @param program_short - The short name of the program.
 * @param program_start - The start date of the program.
 * @param profiles - An array of profile references associated with the program.
 */
async function updateProgram(db: Firestore, program_name: string, program_short: string, program_start: string, profiles: Array<DocumentReference>) {
    try {
        const programCol = collection(db, 'programs');
        const programQuery = query(
            programCol,
            where('program_name', '==', program_name),
            where('program_short', '==', program_short),
            where('program_start', '==', program_start)
        );
        const programSnapshot = await getDocs(programQuery);
        if (programSnapshot.empty) {
            const programData = {
                program_name: program_name,
                program_short: program_short,
                program_start: program_start,
                profiles: profiles
            };
            await addDoc(programCol, programData);
        } else {
            const programDoc = programSnapshot.docs[0];
            const programId = programDoc.id;
            const programData = {
                program_name: program_name,
                program_short: program_short,
                program_start: program_start,
                profiles: profiles
            };
            await setDoc(programDoc.ref, programData);
        }
    } catch (error) {
        console.error("Error updating program: " + program_name, error);
        throw error;
    }
}

/**
 * Retrieves all profiles from the Firestore database.
 * @param db - The Firestore instance.
 * @returns A promise that resolves to an array of profile objects.
 */
async function getProfiles(db: Firestore) {
    async function getProfiles(db: Firestore) {
        try {
            const profilesCol = collection(db, 'profiles');
            const profilesSnapshot = await getDocs(profilesCol);
            const profileList = profilesSnapshot.docs.map(doc => doc.data());
            return profileList;
        } catch (error) {
            console.error("Error retrieving profiles:", error);
            throw error;
        }
    }
}

/**
 * Retrieves all profiles associated with a specific program from the Firestore database.
 * @param db - The Firestore instance.
 * @param program_name - The name of the program to retrieve profiles for.
 * @param program_start - The start date of the program.
 * @returns A promise that resolves to an array of profile objects.
 */
async function getProfilesByProgram(db: Firestore, program_name: string, program_start: string) {
    try {
        const profilesCol = collection(db, 'profiles');
        const profilesQuery = query(
            profilesCol,
            where('program_name', '==', program_name),
            where('program_start', '==', program_start)
        );
        const profilesSnapshot = await getDocs(profilesQuery);
        const profileList = profilesSnapshot.docs.map(doc => doc.data());
        return profileList;
    } catch (error) {
        console.error("Error retrieving profiles for: " + program_name, error);
        throw error;
    }
}

/**
 * Retrieves a specific profile from the Firestore database.
 * @param db - The Firestore instance.
 * @param program_name - The name of the program to retrieve.
 * @param program_start - The start date of the program.
 * @param profile_name - The name of the profile to retrieve.
 * @returns A promise that resolves to the profile object.
 */
async function getProfile(db: Firestore, program_name: string, program_start: string, profile_name: string) {
    try {
        const profileCol = collection(db, 'profiles');
        const profileQuery = query(
            profileCol,
            where('profile_name', '==', profile_name),
            where('program_name', '==', program_name),
            where('program_start', '==', program_start)
        );
        const profileSnapshot = await getDocs(profileQuery);
        const profileData = profileSnapshot.docs.map(doc => doc.data());
        return profileData;
    } catch (error) {
        console.error("Error retrieving profile: " + profile_name + " for " + program_name, error);
        throw error;
    }
}

/**
 * Updates a profile in the Firestore database.
 * If the profile does not exist, it will be added.
 * @param db - The Firestore instance.
 * @param program_name - The name of the program.
 * @param program_start - The start date of the program.
 * @param profile_name - The name of the profile.
 * @param profile_start - The start date of the profile.
 * @param courses - An array of course codes associated with the profile.
 */
async function updateProfile(db: Firestore, program_name: string, program_start: string, profile_name: string, profile_start: string, courses: Array<string>) {
    try {
        const profileCol = collection(db, 'profiles');
        const profileQuery = query(
            profileCol,
            where('profile_name', '==', profile_name),
            where('program_name', '==', program_name),
            where('program_start', '==', program_start),
            where('profile_start', '==', profile_start)
        );
        const profileSnapshot = await getDocs(profileQuery);
        if (profileSnapshot.empty) {
            const profileData = {
                program_name: program_name,
                program_start: program_start,
                profile: profile_name,
                profile_start: profile_start,
                courses: courses
            };
            await addDoc(profileCol, profileData);
        } else {
            const profileDoc = profileSnapshot.docs[0];
            const profileId = profileDoc.id;
            const profileData = {
                program_name: program_name,
                program_start: program_start,
                profile_name: profile_name,
                profile_start: profile_start,
                courses: courses
            };
            await setDoc(profileDoc.ref, profileData);
        }
    } catch (error) {
        console.error("Error updating profile: " + profile_name + " for " + program_name, error);
        throw error;
    }
}

