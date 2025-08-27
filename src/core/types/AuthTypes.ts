export interface IAuthState {
  account: Record<string, any>;
  company: {
    id: number;
  };
  addons: IAddon[];
}

export interface IAddon {
  description: string;
  added: boolean;
}
