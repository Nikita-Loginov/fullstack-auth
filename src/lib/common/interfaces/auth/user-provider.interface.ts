export interface UserProvider {
  providerId: string;
  displayName: string;
  email: string;
  picture?: string | null;
  accessToken: string;
  refreshToken?: string | null;
}
