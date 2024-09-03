import { createTheme } from './Theme';

describe('Theme', () => {
  it('should add custom colors to the theme', () => {
    const theme = createTheme();
    expect(theme.palette.lightGreen).toBeTruthy();
    expect(theme.palette.maximumBlue).toBeTruthy();
    expect(theme.palette.mediumBlue).toBeTruthy();
    expect(theme.palette.navy).toBeTruthy();
    expect(theme.palette.aqua).toBeTruthy();
    expect(theme.palette.pear).toBeTruthy();
  });
});
