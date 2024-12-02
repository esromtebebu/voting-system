const dotenv = require('dotenv');
dotenv.config();

const Admins = require('../models/admins');

const raspiIP = process.env.RASPIIP;
const face_recognition_server = process.env.FACE_RECOGNIZER;

const newAdmin = async (adminObject) => {
    try {
        const admin = new Admins(adminObject);
        console.log("Successfully created new admin.");
        return await admin.save();
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

const findOneByRFID = async (adminRFID) => {
    try {
        const admin = await Admins.findOne({adminRFID: adminRFID});
        console.log("Successfully found admin.");
        return admin;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}
const updateAdmin = async (adminRFID, updatedAdminData) => {
    try {
        const updatedAdmin = await Admins.findOneAndUpdate(
            {adminRFID},
            {$set: {
                adminName: {
                    adminFirstName: updatedAdminData.adminName.adminFirstName,
                    adminLastName: updatedAdminData.adminName.adminLastName
                },
                adminRFID: updatedAdminData.newAdminRFID,
                adminDOB: updatedAdminData.adminDOB,
                adminImage: updatedAdminData.adminImage
            }}
        );
        console.log("Successfully updated admin.");
        return updatedAdmin;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

const deleteAdmin = async (adminRFID) => {
    try {
        const admin = await Admins.findOne(adminRFID);
        console.log("Successfully deleted admin.");
        return await admin.deleteOne(adminRFID);
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

const scanAdminRFID = async () => {
    try {
        let raspiRFID = await fetch(`http://${raspiIP}:5000/scan`);
        raspiRFID = await raspiRFID.json();
        console.log("Successfully scanned RFID.");
        return raspiRFID["RFID"];
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

const takeAdminImage = async () => {
    try {
        let raspiImage = await fetch(`http://${raspiIP}:5000/capture`);
        raspiImage = await raspiImage.json();
        console.log("Successfully captured image.");
        return raspiImage["Face"];
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

const verifyFace = async (adminRFID, newImage) => {
    try {
        const adminImage = await Admins.findOne( 
            { adminRFID: adminRFID},
            { adminImage: 1}
        );
        let results = await fetch(
                                        `${face_recognition_server}`, 
                                        {
                                            method: 'POST',
                                            headers: {
                                            'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                face_a: newImage,
                                                face_b: adminImage.adminImage
                                            })
                                        }
                                    );
        results = await results.json();
        console.log("Facial verification run successfully.");
        return results["verified"];
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

module.exports = { newAdmin, findOneByRFID, updateAdmin, deleteAdmin, scanAdminRFID, takeAdminImage, verifyFace };