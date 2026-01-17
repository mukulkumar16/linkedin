// types/user.ts

export interface UserProfile {
  image?: string | null;
  bio?: string | null;
  headline?: string | null;
  location?: string | null;
  company?: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profile?: UserProfile | null;
}

export interface UserApiResponse {
  success: boolean;
  data: User | null;
}
