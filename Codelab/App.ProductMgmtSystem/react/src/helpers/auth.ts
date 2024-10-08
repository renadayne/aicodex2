import auth0 from 'auth0-js';
class Auth {
  auth0: any;
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN!,
      clientID: process.env.REACT_APP_AUTH0_CLIENTID!,
      responseType: 'token id_token',
      scope: 'openid profile email',
    });
  }

  login = () => {
    this.auth0.authorize();
  };

  handleAuth = () => {
    this.auth0.parseHash((err: any, authResult: any) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        alert(`Error: ${err.error}`);
        console.log(err);
      }
    });
  };

  setSession = (authResult: any) => {
    //set the time the access token will expire
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );

    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  };

  isAuthenticated = () => {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at')!);
    return new Date().getTime() < expiresAt;
  };

  getAccessToken = () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    return accessToken;
  };

  getProfile = () => {
    let profile: any;
    this.auth0.client.userInfo(
      this.getAccessToken(),
      (err: any, profiles: any) => {
        profile = profiles;
      }
    );
    console.log(profile);
    return profile;
  };

  logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENTID!,
      returnTo: 'https://localhost:3000',
    });
  };
}

export default Auth;
