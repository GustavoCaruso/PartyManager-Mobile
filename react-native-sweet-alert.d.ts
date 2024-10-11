declare module 'react-native-sweet-alert' {
    export interface SweetAlertOptions {
      title?: string;
      subTitle?: string;
      confirmButtonTitle?: string;
      confirmButtonColor?: string;
      otherButtonTitle?: string;
      otherButtonColor?: string;
      style?: 'success' | 'error' | 'warning' | 'info';
      cancellable?: boolean;
    }
  
    export default class SweetAlert {
      static showAlertWithOptions(options: SweetAlertOptions, callback?: () => void): void;
      static showAlertWithOptionsAndCancel(
        options: SweetAlertOptions,
        callback?: () => void,
        cancelCallback?: () => void
      ): void;
    }
  }
  