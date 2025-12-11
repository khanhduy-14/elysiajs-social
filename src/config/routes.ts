export const API_ROUTE = {
  AUTH: {
    _: "/auth",
    LOGIN: "/login",
    REGISTER: "/register",
    GENERATE_PASSWORD: "/generate-password",
    REFRESH: "/refresh",
    LOGOUT: "/logout",
  },
  USER: {
    _: "/user",
    ME: "/me",
  },
  POST: {
    _: "/posts",
    DETAIL: "/:id",
  },
} as const;
