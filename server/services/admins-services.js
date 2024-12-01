const dotenv = require('dotenv');
dotenv.config();

const Admins = require('../models/admins');

const raspiIP = process.env.RASPIIP;
const face_recognition_server = process.env.FACE_RECOGNIZER;

export const newAdmin = async (adminObject) => {
    try {
        const admin = new Admins(adminObject);
        console.log("Successfully created new admin.");
        return await admin.save();
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

export const findAdminById = async (adminRFID) => {
    try {
        const admin = await Admins.findOne(adminRFID);
        console.log("Successfully found admin.");
        return admin;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}
export const updateAdmin = async (adminRFID, updatedAdminData) => {
    try {
        const updatedAdmin = await Admins.findOneAndUpdate(
            adminRFID,
            updatedAdminData,
            { new: true }
        );
        console.log("Successfully updated admin.");
        return updatedAdmin;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

export const deleteAdmin = async (adminRFID) => {
    try {
        const admin = await Admins.findOne(adminRFID);
        console.log("Successfully deleted admin.");
        return await admin.deleteOne(adminRFID);
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

export const scanAdminRFID = async () => {
    try {
        const raspiRFID = await fetch(`http://${raspiIP}:5000/scan`)
                                    .then(response => response.json())
                                    .then(data => console.log(data))
                                    .catch(error => console.error(error));
        console.log("Successfully scanned RFID.");
        return raspiRFID;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

export const takeAdminImage = async () => {
    try {
        const raspiImage = await fetch(`http://${raspiIP}:5000/capture`)
                                    .then(response => response.json())
                                    .then(data => console.log(data))
                                    .catch(error => console.error(error));
        console.log("Successfully captured image.");
        return raspiImage;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

export const verifyFace = async (adminRFID, newImage) => {
    try {
        const adminImage = Admins.findOne(
            { adminRFID: adminRFID},
            { adminImage: 1}
        );
        const results = await fetch(
                                        `${face_recognition_server}`, 
                                        {
                                            method: 'POST',
                                            headers: {
                                            'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                            face_a: newImage,
                                            face_b: adminImage
                                            })
                                    }
                                    )
                                        .then(response => response.json())
                                        .then(data => console.log(data)) 
                                        .catch(error => console.error(error))
                                    ;
        return results;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}