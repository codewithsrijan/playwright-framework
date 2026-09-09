export function createUserAuthenticationRequest(loginName: string, password: string) {
  return {
    user_login_name_or_email: loginName,
    password_in_plain_text: password,
    client: "LEARNER_DESKTOP",
  };
}

