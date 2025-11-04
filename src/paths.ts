export const landingPagePath = () => "/";
export const signInPagePath = () => "/auth/sign-in";
export const signUpPagePath = () => "/auth/sign-up";
export const businessesPagePath = () => "/businesses";
export const businessPagePath = (businessId: string) => `/businesses/${businessId}`;
export const commandCenterPagePath = (businessId: string) => `/businesses/${businessId}/command-center`;
export const newBusinessPagePath = () => "/businesses/new";
export const homePagePath = () => "/home";
