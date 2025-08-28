export { colors } from './colors';
export { typography, fontWeights, fontSizes } from './typography';
export { spacing, layout } from './spacing';

// Theme object for easy access
export const theme = {
  colors: require('./colors').colors,
  typography: require('./typography').typography,
  spacing: require('./spacing').spacing,
  layout: require('./spacing').layout,
};
