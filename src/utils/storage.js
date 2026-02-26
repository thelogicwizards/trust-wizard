import localforage from 'localforage';

// Initialize the IndexedDB store
localforage.config({
    name: 'TrustAgent',
    storeName: 'trust_portfolio'
});

const STORAGE_KEY = 'trust_data_v3';

export const saveTrustData = async (data) => {
    try {
        await localforage.setItem(STORAGE_KEY, data);
        console.log('Trust data successfully saved to local storage.');
    } catch (err) {
        console.error('Error saving trust data:', err);
    }
};

export const loadTrustData = async () => {
    try {
        const data = await localforage.getItem(STORAGE_KEY);
        return data;
    } catch (err) {
        console.error('Error loading trust data:', err);
        return null;
    }
};

export const clearTrustData = async () => {
    try {
        await localforage.removeItem(STORAGE_KEY);
        console.log('Trust data cleared from local storage.');
    } catch (err) {
        console.error('Error clearing trust data:', err);
    }
};
