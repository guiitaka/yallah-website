declare interface AddToHomeScreenOptions {
  appName: string;
  appIconUrl: string;
  assetUrl?: string;
  maxModalDisplayCount?: number;
  appNameDisplay?: 'standalone' | 'inline';
  displayOptions?: {
    showMobile: boolean;
    showDesktop: boolean;
  };
  allowClose?: boolean;
}

declare interface AddToHomeScreenType {
  appName: string;
  appIconUrl: string;
  assetUrl: string;
  maxModalDisplayCount: number;
  displayOptions: {
    showMobile: boolean;
    showDesktop: boolean;
  };
  allowClose: boolean;
  clearModalDisplayCount: () => void;
  isStandAlone: () => boolean;
  show: (locale: string) => void;
  closeModal: () => void;
  modalIsShowing: () => boolean;
  isBrowserAndroidChrome: () => boolean;
  isBrowserAndroidFacebook: () => boolean;
  isBrowserAndroidFirefox: () => boolean;
  isBrowserAndroidSamsung: () => boolean;
  isBrowserIOSChrome: () => boolean;
  isBrowserIOSFirefox: () => boolean;
  isBrowserIOSInAppFacebook: () => boolean;
  isBrowserIOSInAppInstagram: () => boolean;
  isBrowserIOSInAppLinkedin: () => boolean;
  isBrowserIOSInAppThreads: () => boolean;
  isBrowserIOSInAppTwitter: () => boolean;
  isBrowserIOSSafari: () => boolean;
  isDesktopChrome: () => boolean;
  isDesktopEdge: () => boolean;
  isDesktopMac: () => boolean;
  isDesktopSafari: () => boolean;
  isDesktopWindows: () => boolean;
}

declare interface Window {
  AddToHomeScreen: (options: AddToHomeScreenOptions) => AddToHomeScreenType;
  AddToHomeScreenInstance?: AddToHomeScreenType;
} 