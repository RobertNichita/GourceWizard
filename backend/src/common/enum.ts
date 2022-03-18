/**
 * if set to 1, ssl certificate will not be verified when delivering payloads in octokit
 */
enum INSECURE_SSL {
  INSECURE = 1,
  SECURE = 0,
}

enum CONTENT_TYPE {
  JSON = 'application/json',
  FORM = 'application/x-www-form-urlencoded',
}

enum ENVIRONMENT {
  PROD = 'production',
  DEV = 'development',
}

export {INSECURE_SSL, CONTENT_TYPE, ENVIRONMENT};
