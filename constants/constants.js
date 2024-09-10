// E-mail constraints and checks
export const emailMinLength = 6;
export const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
export const emailChecks = [
  {
    regex: /^[^\s@]+@/,
    tip: "should contain characters before the '@' symbol",
  },
  {
    regex: /@[^.\s@]+\./,
    tip: "should contain a domain name after the '@' symbol and a '.'",
  },
  {
    regex: /\.[a-zA-Z]{2,}$/,
    tip: "should end with a valid top-level domain (TLD) after a '.'",
  },
  {
    regex: new RegExp(`^.{${emailMinLength},}$`),
    tip: `should have a minimum length of ${emailMinLength} characters`,
  },
];

// Password constraints and checks
export const passwordMinLength = 8;
export const passwordChecks = [
  {
    regex: new RegExp(`^.{${passwordMinLength},}$`),
    tip: `should have a minimum length of ${passwordMinLength} characters`,
  },
  {
    regex: /[A-Za-z]/,
    tip: `should contain at least one letter (either uppercase or lowercase)`,
  },
  {
    regex: /\d/,
    tip: `should contain at least one digit`,
  },
  {
    regex: /^[A-Za-z\d@#%^$_!%*?)(&]+$/,
    tip: `may include special characters like @, #, %, ^, $, _, !, %, *, ?, ), (, and &`,
  },
];

/**
 * The expiration time for JWT tokens.
 * This determines how long the token will remain valid.
 *
 * The format is a string that represents the duration. Common values include:
 * - "30m": 30 minutes
 * - "1h": 1 hour
 * - "23h": 23 hours
 * - "1d": 1 day
 * - "7d": 7 days
 * - "2M": 2 months (approximately 60 days)
 */
export const jwtTokenExpirationTime = "23h";

// "public" directory name for serving static files
// Serves files like images, CSS files, and JavaScript files
export const defaultPublicFolderName = "public";

// File storage settings
export const defaultTempFolderPathArr = ["temp"];

// Images settings
export const imagesAllowedExtensions = ["jpg", "jpeg", "png"];

export const avatarsFolderRelPath = ["avatars"]; // inside public folder
export const avatarMaxFileSizeKB = 1024;
export const defaultAvatarFileName = "avatar_default.jpg";

export const recipesFolderRelPath = ["recipes"]; // inside public folder
export const recipeMaxFileSizeKB = 1024;

export const ingredientsFolderRelPath = ["ingredients"]; // inside public folder
export const ingredientMaxFileSizeKB = 1024;
