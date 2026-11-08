import { router, Tabs, usePathname } from 'expo-router';
import { BottomNavigation } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TABS = [
    { key: 'pantry', title: 'Dispensa', href: '/pantry', focusedIcon: 'basket', unfocusedIcon: 'basket-outline' },
    { key: 'meal-plan', title: 'Meal Plan', href: '/meal-plan', focusedIcon: 'calendar-month', unfocusedIcon: 'calendar-month-outline' },
    { key: 'settings', title: 'Altro', href: '/settings', focusedIcon: 'dots-horizontal-circle', unfocusedIcon: 'dots-horizontal-circle-outline' },
];

function AppTabBar() {
    const pathname = usePathname();
    const insets = useSafeAreaInsets();

    const found = TABS.findIndex((t) => pathname.startsWith(t.href));
    const index = found === -1 ? 0 : found;

    return (
        <BottomNavigation.Bar
            navigationState={{ index, routes: TABS }}
            safeAreaInsets={insets}
            onTabPress={({ route }) => {
                const current = TABS[index];
                const isDeep = pathname !== current.href;

                if (current.key === route.key) {
                    if (isDeep) router.dismissTo(route.href);
                    return;
                }

                if (isDeep) router.dismissTo(current.href);
                router.navigate(route.href);
            }}
        />
    );
}

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }} tabBar={() => <AppTabBar />}>
            <Tabs.Screen name="pantry" options={{ title: 'Dispensa' }} />
            <Tabs.Screen name="meal-plan" options={{ title: 'Meal Plan' }} />
            <Tabs.Screen name="settings" options={{ title: 'Altro' }} />
        </Tabs>
    );
}