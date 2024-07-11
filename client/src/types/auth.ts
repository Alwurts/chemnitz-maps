export type AuthToken = {
  exp: number;
  iat: number;
  user_id: number;
  user_type: "basic" | "premium";
  token_type: string;
  jti: string;
};

export type AuthTokens = {
  userId: number;
  userType: "basic" | "premium";
};

export type User = {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
};
