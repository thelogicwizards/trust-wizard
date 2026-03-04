import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { loadTrustData, saveTrustData } from './storage';

export const exportVaultToZip = async () => {
    try {
        const trustData = await loadTrustData();
        if (!trustData) {
            alert('No trust data found to backup.');
            return false;
        }

        const zip = new JSZip();

        // Save the configuration/metadata
        const configData = {
            ...trustData,
            documents: trustData.documents.map(doc => ({
                ...doc,
                // If it's a real file we uploaded, remove the massive base64 string from the json payload 
                // because we are putting it into a separate file in the zip
                fileUrl: doc.fileUrl ? `files/${doc.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${doc.fileType.split('/')[1] || 'png'}` : null,
                originalFileUrl: doc.fileUrl // Keep temp
            }))
        };

        // Remove the temporary originalFileUrl before stringifying
        const cleanConfigData = JSON.parse(JSON.stringify(configData));
        cleanConfigData.documents.forEach(doc => delete doc.originalFileUrl);

        zip.file("trust_vault_config.json", JSON.stringify(cleanConfigData, null, 2));

        // Create a folder for the actual physical files
        const filesFolder = zip.folder("files");

        // Iterate through documents and add base64 images as actual files
        configData.documents.forEach(doc => {
            if (doc.originalFileUrl && doc.originalFileUrl.startsWith('data:image/')) {
                // Determine file extension
                const extension = doc.fileType ? doc.fileType.split('/')[1] : 'png';
                const filename = `${doc.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${extension}`;

                // Strip the data:image/...;base64, prefix
                const base64Data = doc.originalFileUrl.split(',')[1];

                // Add to zip
                filesFolder.file(filename, base64Data, { base64: true });
            }
        });

        // Generate the zip and trigger download
        const blob = await zip.generateAsync({ type: "blob" });
        const dateStr = new Date().toISOString().split('T')[0];
        saveAs(blob, `Trust_Agent_Backup_${dateStr}.zip`);

        return true;
    } catch (error) {
        console.error("Backup Export Failed: ", error);
        alert("An error occurred while creating the backup.");
        return false;
    }
};

export const importVaultFromZip = async (file) => {
    try {
        const zip = new JSZip();
        const loadedZip = await zip.loadAsync(file);

        // 1. Read the config file
        const configFile = loadedZip.file("trust_vault_config.json");
        if (!configFile) {
            alert("Invalid backup file. Missing configuration.");
            return false;
        }

        const configStr = await configFile.async("string");
        const trustData = JSON.parse(configStr);

        // 2. Re-attach base64 strings to documents
        for (let doc of trustData.documents) {
            if (doc.fileUrl && doc.fileUrl.startsWith('files/')) {
                const zipFile = loadedZip.file(doc.fileUrl);
                if (zipFile) {
                    const base64Data = await zipFile.async("base64");
                    // Reconstruct data URL
                    doc.fileUrl = `data:${doc.fileType || 'image/png'};base64,${base64Data}`;
                } else {
                    console.warn(`File ${doc.fileUrl} missing from archive.`);
                }
            }
        }

        // 3. Save to local storage
        await saveTrustData(trustData);
        return trustData;
    } catch (error) {
        console.error("Backup Import Failed: ", error);
        alert("An error occurred while restoring the backup. Please ensure it is a valid Trust Agent ZIP file.");
        return null;
    }
};
