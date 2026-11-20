import { useEffect, useState } from 'react';
import { Animated, Image, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

// Same values as the expo-splash-screen plugin in app.json, so the hand-off
// from the native splash to this overlay is seamless.
const BACKGROUND = '#FF8D4F';
const LOGO_SIZE = 200;
const HOLD_MS = 1200;
const FADE_MS = 400;

type Props = {
    onFinish: () => void;
};

/**
 * Branded splash drawn in JS, shown right after the native splash.
 * The native splash can only show a centered image, so the credit line lives here.
 */
export function AppSplash({ onFinish }: Props) {
    const [opacity] = useState(() => new Animated.Value(1));
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const timer = setTimeout(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: FADE_MS,
                useNativeDriver: true,
            }).start(() => onFinish());
        }, HOLD_MS);
        return () => clearTimeout(timer);
    }, [opacity, onFinish]);

    return (
        <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, styles.container, { opacity }]}
            onLayout={() => SplashScreen.hide()}
        >
            <Image
                source={require('../assets/splash-icon.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>Smarty Food</Text>
            <Text style={[styles.credit, { bottom: insets.bottom + 24 }]}>
                Developed by Pietro Di Giovanni
            </Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: BACKGROUND,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        elevation: 1000,
    },
    logo: { width: LOGO_SIZE, height: LOGO_SIZE },
    title: {
        position: 'absolute',
        top: '50%',
        marginTop: LOGO_SIZE / 2 - 40,
        color: '#FFF8F6',
        fontSize: 26,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    credit: {
        position: 'absolute',
        color: '#FFF8F6',
        fontSize: 12,
        opacity: 0.85,
    },
});
