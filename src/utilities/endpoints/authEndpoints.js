export const AUTH_ENDPOINTS = {
  login: "/api/Account/Login",
  register: "/api/Account/Register",
  confirmEmail: "/api/Account/ConfirmEmail",
  externalLogin: (provider, role) =>
    `/api/Account/ExternalLogin?provider=${provider}&role=${role}`,
};
