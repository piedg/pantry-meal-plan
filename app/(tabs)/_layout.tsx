import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="pantry"
                options={{
                    title: 'Dispensa',

                }}
            />
            <Tabs.Screen
                name="meal-plan"
                options={{
                    title: 'Meal Plan',

                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Altro',

                }}
            />
        </Tabs>
    );
}