export const MIN_PASSWORD_LENGTH: number = 8;
export const MAX_PASSWORD_LENGTH: number = 32;

export const MIN_USERNAME_LENGTH: number = 1;
export const MAX_USERNAME_LENGTH: number = 16;

export const MIN_WEIGHT_VALUE: number = 30;
export const MAX_WEIGHT_VALUE: number = 500;

export const MIN_HEIGHT_VALUE: number = 40;
export const MAX_HEIGHT_VALUE: number = 240;

export const MIN_NAME_LENGTH: number = 1;
export const MAX_NAME_LENGTH: number = 256;
export const NAME_REGEX: RegExp = /^[\p{L}]+(?:[\s\-][\p{L}]+)*$/u;

export const MIN_SURNAME_LENGTH: number = 1;
export const MAX_SURNAME_LENGTH: number = 256;
export const SURNAME_REGEX: RegExp = /^[\p{L}]+(?:['\s\-][\p{L}]+)*$/u;

/*
    ^ : Inizia qui.
    [\p{L}]+ : Deve iniziare con almeno una lettera.
    (?: ... )* : Un gruppo che può ripetersi zero o più volte.
    ['\s\-] : All'interno del nome/cognome può esserci un apostrofo (solo per il cognome), uno spazio o un trattino.
    [\p{L}]+ : Dopo lo spazio/apostrofo/trattino deve esserci obbligatoriamente un'altra lettera.
    $ : Finisce qui.
    u : Flag Unicode, \p{L} deve leggere tutti i caratteri internazionali.
*/

export const MIN_MOD_PASSWORD_LENGTH: number = 12;
export const MAX_MOD_PASSWORD_LENGTH: number = 32;

export const MIN_MOD_USERNAME_LENGTH: number = 8;
export const MAX_MOD_USERNAME_LENGTH: number = 15;

export const VERIFY_MIN_SESSIONS: number = 30;
export const VERIFY_MIN_FOLLOWERS: number = 500;
export const VERIFY_MIN_AGE: number = 18;

export const PROPIC_PATH: string = "assets/icon/favicon.png";

export const SEASONAL_RANK_UP: number = 100;
export const GLOBAL_RANK_UP: number = 50;