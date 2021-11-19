export const MAIN_MENU_TOKEN = Symbol('MainMenu');

export interface MainMenuSettings {
  title: string;
  logo: string;
  developer: string;
  developerLogo: string;
  options: MainMenuOption[];
}

export interface MainMenuOption {
  name: string;
  event: string;
}
