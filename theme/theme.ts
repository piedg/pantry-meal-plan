import { MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper';
import raw from './material-theme.json';

type Scheme = typeof raw.schemes.light;

const build = (base: MD3Theme, s: Scheme): MD3Theme => ({
    ...base,
    colors: {
        ...base.colors,
        ...s,
        elevation: {
            level0: 'transparent',
            level1: s.surfaceContainerLow,
            level2: s.surfaceContainer,
            level3: s.surfaceContainerHigh,
            level4: s.surfaceContainerHigh,
            level5: s.surfaceContainerHighest,
        },
    },
});

export const lightTheme = build(MD3LightTheme, raw.schemes.light);
export const darkTheme = build(MD3DarkTheme, raw.schemes.dark);