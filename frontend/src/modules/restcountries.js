export async function getCountries() {
    const url = 'https://restcountries.com/v3.1/all'; 
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network not response');
        }
        const countries = await response.json();
        return countries;
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
}