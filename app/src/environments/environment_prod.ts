// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  api_url: "http://angular-phalcon-jwt.localhost.com/",
  storage: {
  	current_user: "angular_phalcon_jwt_current_user",
  	security_token: "angular_phalcon_jwt_security_token",
  	session_expiry: "angular_phalcon_jwt_session_expired",
  	active_branch: "angular_phalcon_jwt_active_branch"
  }
  
};
