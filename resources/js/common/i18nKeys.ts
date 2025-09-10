export const I18N_KEYS = {
  common: {
    yes: 'common.yes',
    no: 'common.no',
    cancel: 'common.cancel',
    save: 'common.save',
    close: 'common.close',
    loading: 'common.loading',
  },
  auth: {
    welcome: 'auth.welcome',
    signIn: 'auth.sign_in',
    signUp: 'auth.sign_up',
    email: 'auth.email',
    password: 'auth.password',
    forgotPassword: 'auth.forgot_password',
  },
  validation: {
    required: 'validation.required',
    email: 'validation.email',
    minLength: 'validation.min_length',
    maxLength: 'validation.max_length',
  },
  seller: {
    login: {
      title: 'seller.login.title',
      subtitle: 'seller.login.subtitle',
      button: 'seller.login.button',
      or: 'seller.login.or',
      google: 'seller.login.google',
    },
  },
} as const;

export type TranslationKey =
  | typeof I18N_KEYS[keyof typeof I18N_KEYS][keyof typeof I18N_KEYS.common]
  | typeof I18N_KEYS[keyof typeof I18N_KEYS][keyof typeof I18N_KEYS.auth]
  | typeof I18N_KEYS[keyof typeof I18N_KEYS][keyof typeof I18N_KEYS.validation];

export type DeepValueOf<T> = T extends object
  ? DeepValueOf<T[keyof T]>
  : T;

export type AnyTranslationKey = DeepValueOf<typeof I18N_KEYS>;
