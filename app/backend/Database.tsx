'use server';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Firestore, getFirestore, collection, getDocs, query, where, addDoc, setDoc, DocumentReference } from 'firebase/firestore/lite';
import { env } from "process";
import { get } from "http";
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

const appDb = initializeApp(firebaseConfig);
//const analytics = getAnalytics(appDb);
const db = getFirestore(appDb);

/**
 * Retrieves all programs from the Firestore database.
 * @returns A promise that resolves to an array of program objects.
 */
export async function getPrograms() {
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
 * @param program_name - The name of the program to retrieve.
 * @param program_start - The start date of the program.
 * @returns A promise that resolves to the program object.
 */
export async function getProgram(program_name: string, program_start: string) {
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
 * @param program_name - The name of the program.
 * @param program_short - The short name of the program.
 * @param program_start - The start date of the program.
 * @param profiles - An array of profile references associated with the program.
 */
export async function updateProgram(program_name: string, program_short: string, program_start: string, profiles: Array<DocumentReference>) {
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
 * Retrieves all program years associated with a specific program from the Firestore database.
 * @param program_name - The name of the program to retrieve program years for.
 * @returns A promise that resolves to an array of program years.
 */
export async function getProgramYears(program_name: string) {
    try {
        const programCol = collection(db, 'programs');
        const programQuery = query(programCol, where('program_name', '==', program_name));
        const programSnapshot = await getDocs(programQuery);
        const programData = programSnapshot.docs.map(doc => doc.data()['program_start']);
        return programData;
    } catch (error) {
        console.error("Error retrieving program: " + program_name, error);
        throw error;
    }
}

/**
 * Retrieves all profiles from the Firestore database.
 * @returns A promise that resolves to an array of profile objects.
 */
export async function getProfiles() {
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


/**
 * Retrieves all profiles associated with a specific program from the Firestore database.
 * @param program_name - The name of the program to retrieve profiles for.
 * @param program_start - The start date of the program.
 * @returns A promise that resolves to an array of profile objects.
 */
export async function getProfilesByProgram(program_name: string, program_start: string) {
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
 * @param program_name - The name of the program to retrieve.
 * @param program_start - The start date of the program.
 * @param profile_name - The name of the profile to retrieve.
 * @returns A promise that resolves to the profile object.
 */
export async function getProfile(program_name: string, program_start: string, profile_name: string) {
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
 * @param program_name - The name of the program.
 * @param program_start - The start date of the program.
 * @param profile_name - The name of the profile.
 * @param courses - An array of course codes associated with the profile.
 */
export async function updateProfile(program_name: string, program_start: string, profile_name: string, courses: Array<string>) {
    try {
        const profileCol = collection(db, 'profiles');
        const profileQuery = query(
            profileCol,
            where('profile_name', '==', profile_name),
            where('program_name', '==', program_name),
            where('program_start', '==', program_start),
        );
        const profileSnapshot = await getDocs(profileQuery);
        if (profileSnapshot.empty) {
            const profileData = {
                program_name: program_name,
                program_start: program_start,
                profile: profile_name,
                courses: courses
            };
            const profileDocRef = await addDoc(profileCol, profileData);

            // Update the program to include the new profile reference
            const programData = await getProgram(program_name, program_start);
            const profileRef = programData[0]['profiles'];
            profileRef.push(profileDocRef);
        } else {
            const profileDoc = profileSnapshot.docs[0];
            const profileId = profileDoc.id;
            const profileData = {
                program_name: program_name,
                program_start: program_start,
                profile_name: profile_name,
                courses: courses
            };
            await setDoc(profileDoc.ref, profileData);
        }
    } catch (error) {
        console.error("Error updating profile: " + profile_name + " for " + program_name, error);
        throw error;
    }
}

export async function updateCourse(program_name: string, program_start: string, profile_name: string, course_semester: string, course_period: string, course_code: string, course_field: string[], course_vof: string, course_block: string, course_name: string, course_points: string, course_level: string) {
    try {
        const courseCol = collection(db, 'courses');
        const courseQuery = query(
            courseCol,
            where('course_code', '==', course_code),
            where('program_name', '==', program_name),
            where('program_start', '==', program_start),
            where('profile_name', '==', profile_name),
            where('course_period', '==', course_period),
            where('course_semester', '==', course_semester)
        );
        const courseSnapshot = await getDocs(courseQuery);
        if (courseSnapshot.empty) {
            const courseData = {
                program_name: program_name,
                program_start: program_start,
                profile_name: profile_name,
                course_semester: course_semester,
                course_period: course_period,
                course_code: course_code,
                course_name: course_name,
                course_points: course_points,
                course_block: course_block,
                course_field: course_field,
                course_vof: course_vof,
                course_level: course_level
            };
            await addDoc(courseCol, courseData);
            await getProfile(program_name, program_start, profile_name).then(
                (data) => {
                    let courses = data[0]['courses'];
                    if (course_code in courses) return;
                    courses.push(course_code);
                    updateProfile(program_name, program_start, profile_name, courses);
                }
            );
        } else {
            const courseDoc = courseSnapshot.docs[0];
            const courseId = courseDoc.id;
            const courseData = {
                program_name: program_name,
                program_start: program_start,
                profile_name: profile_name,
                course_semester: course_semester,
                course_period: course_period,
                course_code: course_code,
                course_name: course_name,
                course_points: course_points,
                course_block: course_block,
                course_field: course_field,
                course_vof: course_vof,
                course_level: course_level
            };
            await setDoc(courseDoc.ref, courseData);
        }
    } catch (error) {
        console.error("Error updating course: " + course_code + " for " + program_name, error);
        throw error;
    }
}