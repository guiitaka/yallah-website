interface AddToHomeScreenOptions {
  appName: string;
  appNameDisplay?: 'standalone' | 'inline';
  appIconUrl: string;
  assetUrl: string;
  maxModalDisplayCount?: number;
  displayOptions?: { showMobile: boolean; showDesktop: boolean };
  allowClose?: boolean;
}

interface AddToHomeScreenType {
  show: (locale?: string) => void;
}

declare global {
  interface Window {
    AddToHomeScreen(options: {
      appName: string;
      appNameDisplay?: 'standalone' | 'inline';
      appIconUrl: string;
      assetUrl: string;
      maxModalDisplayCount?: number;
      displayOptions?: { showMobile: boolean; showDesktop: boolean };
      allowClose?: boolean;
    }): {
      show: (locale?: string) => void;
    };
    AddToHomeScreenInstance: {
      show: (locale?: string) => void;
    };
  }
} 