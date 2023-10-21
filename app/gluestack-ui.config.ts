// gluestack-ui.config.ts
import {config as defaultConfig, createConfig} from '@gluestack-ui/themed';

export const config = createConfig({
  ...defaultConfig.theme,
  aliases: {
    ...defaultConfig.theme.aliases,
    jc: 'justifyContent',
  },
  tokens: {
    ...defaultConfig.theme.tokens,
    colors: {
      ...defaultConfig.theme.tokens.colors,
      primary0: '#ffffff',
      primary100: '#def2f0',
      primary200: '#c5e8e4',
      primary300: '#aaddd8',
      primary400: '#8cd0c9',
      primary500: '#69c2b9',
      primary600: '#3eb0a5',
      primary700: '#009788',
      primary800: '#007a6e',
      primary900: '#004841',
      primary950: '#000000',

      secondary0: '#f9f9f9',
      secondary100: '#eceeee',
      secondary200: '#dee1e1',
      secondary300: '#cfd4d3',
      secondary400: '#bfc5c4',
      secondary500: '#acb5b4',
      secondary600: '#97a2a1',
      secondary700: '#7f8c8a',
      secondary800: '#5f6f6e',
      secondary900: '#334241',
      secondary950: '#000000',
    },
    fontSizes: {
      ...defaultConfig.theme.tokens.fontSizes,
      newFontSize: 90,
    },
  },
  components: {
    Button: {
      theme: {
        variants: {
          variant: {
            agpaii: {
              bg: '$primary700',

              _text: {
                color: '$white',
              },
            },
            default: {
              bg: '$grey',
              _text: {
                color: '$black',
              },
            },
          },
        },
      },
    },
  },
});

// Get the type of Config
type ConfigType = typeof config;

// Extend the internal ui config
declare module '@gluestack-ui/themed' {
  interface UIConfig extends ConfigType {}
}
