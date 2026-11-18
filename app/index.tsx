import { Redirect } from 'expo-router';

// All'avvio l'app apre "/": la mandiamo alla tab Dispensa
export default function Index() {
    return <Redirect href="/pantry" />;
}
