class ThemeManager {
    constructor() {
      this.themes = {
        night: { dark: '255, 255, 255', light: '10, 10, 20' },
        day: { dark: '10, 10, 20', light: '255, 255, 255' },
        // Add more themes as needed
      };
    }
  
    setTheme(theme) {
      if (this.themes[theme]) {
        const { dark, light } = this.themes[theme];
        document.documentElement.style.setProperty('--color-dark', dark);
        document.documentElement.style.setProperty('--color-light', light);
      }
    }
  }
  
  export default ThemeManager;
  