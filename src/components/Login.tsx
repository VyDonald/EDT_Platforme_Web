import { useState, useEffect } from 'react';
import { login, register, socialLogin } from '../services/api';

// Properly type the window.google and window.FB objects
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: GoogleResponse) => void; auto_select: boolean }) => void;
          renderButton: (element: HTMLElement | null, options: { theme: string; size: string; width: string; text: string; locale: string }) => void;
        };
      };
    };
    FB?: {
      init: (config: { appId: string; cookie: boolean; xfbml: boolean; version: string }) => void;
      login: (callback: (response: { authResponse?: { accessToken: string }; status: string }) => void, options: { scope: string }) => void;
      api: (path: string, params: { fields: string }, callback: (response: { name: string; email?: string; picture?: { data: { url: string } } }) => void) => void;
    };
  }
}

// Interface for Google response
interface GoogleResponse {
  credential?: string;
  [key: string]: any;
}

// User interface for onLoginSuccess
interface User {
  name: string;
  email: string;
  profilePic?: string;
  provider?: 'email' | 'google' | 'facebook';
}

interface LoginProps {
  onLoginSuccess: (user: User, token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  // Authentication states
  const [isLoginView, setIsLoginView] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [nom, setNom] = useState<string>(''); // Changé de fullName à nom et prenom
  const [prenom, setPrenom] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Script loading states
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState<boolean>(false);
  const [fbScriptLoaded, setFbScriptLoaded] = useState<boolean>(false);

  // Load Google authentication script
  useEffect(() => {
    const loadGoogleScript = () => {
      if (document.querySelector('script#google-oauth')) {
        setGoogleScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.id = 'google-oauth';
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleScriptLoaded(true);

      document.body.appendChild(script);
    };

    loadGoogleScript();

    return () => {
      const script = document.querySelector('script#google-oauth');
      if (script) document.body.removeChild(script);
    };
  }, []);

  // Load Facebook authentication script
  useEffect(() => {
    const loadFacebookScript = () => {
      if (document.querySelector('script#facebook-sdk')) {
        setFbScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.id = 'facebook-sdk';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setFbScriptLoaded(true);
        if (window.FB) {
          window.FB.init({
            appId: 'YOUR_FACEBOOK_APP_ID',
            cookie: true,
            xfbml: true,
            version: 'v16.0',
          });
        }
      };

      document.body.appendChild(script);
    };

    loadFacebookScript();

    return () => {
      const script = document.querySelector('script#facebook-sdk');
      if (script) document.body.removeChild(script);
    };
  }, []);

  // Initialize Google Sign-In
  useEffect(() => {
    if (!googleScriptLoaded || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
      callback: handleGoogleResponse,
      auto_select: false,
    });

    const renderGoogleButton = () => {
      const element = document.getElementById('google-signin-button');
      if (element && window.google) {
        window.google.accounts.id.renderButton(element, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          locale: 'fr_FR',
        });
      }
    };

    renderGoogleButton();
  }, [googleScriptLoaded, isLoginView]);

  // Handle Google authentication response
  const handleGoogleResponse = async (response: GoogleResponse) => {
    if (response.credential) {
      try {
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const decodedToken = JSON.parse(jsonPayload);

        const socialData = {
          provider: 'google' as const,
          token: response.credential,
          name: decodedToken.name,
          email: decodedToken.email,
          profilePic: decodedToken.picture,
        };

        const authResponse = await socialLogin(socialData);
        const user: User = {
          name: authResponse.utilisateur.nom + ' ' + authResponse.utilisateur.prenom,
          email: authResponse.utilisateur.email,
          profilePic: authResponse.utilisateur.profilePic,
          provider: authResponse.utilisateur.provider,
        };
        localStorage.setItem('token', authResponse.token);
        onLoginSuccess(user, authResponse.token);
      } catch (err) {
        setError('Erreur lors de la connexion Google');
        console.error(err);
      }
    }
  };

  // Handle Login form submission
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      const credentials = { email: username, password };
      console.log('Envoi des identifiants :', credentials);
      const authResponse = await login(credentials);
      const user: User = {
        name: authResponse.utilisateur.nom + ' ' + authResponse.utilisateur.prenom,
        email: authResponse.utilisateur.email,
        provider: 'email',
      };
      localStorage.setItem('token', authResponse.token);
      onLoginSuccess(user, authResponse.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la connexion');
      console.error('Erreur complète :', err.response?.data);
    }
  };

  // Handle Signup form submission
  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!nom || !prenom || !email || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const registerData = {
        nom,
        prenom,
        email,
        password,
        password_confirmation: confirmPassword,
      };
      const authResponse = await register(registerData);
      const user: User = {
        name: authResponse.utilisateur.nom + ' ' + authResponse.utilisateur.prenom,
        email: authResponse.utilisateur.email,
        provider: 'email',
      };
      localStorage.setItem('token', authResponse.token);
      onLoginSuccess(user, authResponse.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l’inscription');
      console.error(err);
    }
  };

  // Handle Facebook login/signup
  const handleFacebookLogin = async () => {
    if (!fbScriptLoaded || !window.FB) {
      setError('Facebook SDK non chargé. Réessayez.');
      return;
    }

    try {
      window.FB.login(
        (response) => {
          if (response.authResponse) {
            window.FB!.api('/me', { fields: 'name,email,picture' }, async (userInfo) => {
              try {
                const socialData = {
                  provider: 'facebook' as const,
                  token: response.authResponse!.accessToken,
                  name: userInfo.name,
                  email: userInfo.email || 'email@example.com',
                  profilePic: userInfo.picture?.data?.url,
                };

                const authResponse = await socialLogin(socialData);
                const user: User = {
                  name: authResponse.utilisateur.nom + ' ' + authResponse.utilisateur.prenom,
                  email: authResponse.utilisateur.email,
                  profilePic: authResponse.utilisateur.profilePic,
                  provider: authResponse.utilisateur.provider,
                };
                localStorage.setItem('token', authResponse.token);
                onLoginSuccess(user, authResponse.token);
              } catch (err) {
                setError('Erreur lors de la connexion Facebook');
                console.error(err);
              }
            });
          } else {
            setError('Connexion Facebook annulée');
          }
        },
        { scope: 'public_profile,email' }
      );
    } catch (err) {
      setError('Erreur lors de la connexion Facebook');
      console.error(err);
    }
  };

  // Toggle between login and signup views
  const toggleAuthView = () => {
    setIsLoginView(!isLoginView);
    setUsername('');
    setPassword('');
    setEmail('');
    setNom('');
    setPrenom('');
    setConfirmPassword('');
    setError(null);
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginCard}>
        <div style={styles.leftSide}>
          <h1 style={styles.welcomeTitle}>
            {isLoginView ? 'Welcome to\nGalaxy Page' : 'Join\nGalaxy Page'}
          </h1>

          {isLoginView ? (
            // LOGIN FORM
            <form onSubmit={handleLoginSubmit}>
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  placeholder="Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputContainer}>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.rememberForgot}>
                <label style={styles.rememberMe}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <span style={{ marginLeft: 10 }}>Remember me</span>
                </label>
                <a href="#" style={styles.forgotPassword}>
                  Forgot your password?
                </a>
              </div>

              {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

              <div style={styles.buttonsContainer}>
                <button type="submit" style={styles.loginButton}>
                  Login
                </button>
                <button type="button" style={styles.signupButton} onClick={toggleAuthView}>
                  Sign Up
                </button>
              </div>

              <div style={styles.divider}>
                <span style={styles.dividerText}>or continue with</span>
              </div>

              <div style={styles.socialLogin}>
                <div id="google-signin-button" style={styles.googleBtnContainer}></div>
                <button type="button" style={styles.facebookBtn} onClick={handleFacebookLogin}>
                  <div style={styles.socialIcon}>f</div>
                  <span style={styles.socialButtonText}>Continue with Facebook</span>
                </button>
              </div>
            </form>
          ) : (
            // SIGNUP FORM
            <form onSubmit={handleSignupSubmit}>
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  placeholder="Nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputContainer}>
                <input
                  type="text"
                  placeholder="Prénom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputContainer}>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputContainer}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputContainer}>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

              <div style={styles.buttonsContainer}>
                <button type="submit" style={styles.loginButton}>
                  Sign Up
                </button>
                <button type="button" style={styles.signupButton} onClick={toggleAuthView}>
                  Login
                </button>
              </div>

              <div style={styles.divider}>
                <span style={styles.dividerText}>or sign up with</span>
              </div>

              <div style={styles.socialLogin}>
                <div id="google-signin-button" style={styles.googleBtnContainer}></div>
                <button type="button" style={styles.facebookBtn} onClick={handleFacebookLogin}>
                  <div style={styles.socialIcon}>f</div>
                  <span style={styles.socialButtonText}>Continue with Facebook</span>
                </button>
              </div>
            </form>
          )}
        </div>

        <div style={styles.rightSide}>
          <div style={styles.logo}>YOUR LOGO</div>
        </div>
      </div>
    </div>
  );
};

// Styles (inchangés)
const styles: { [key: string]: React.CSSProperties } = {
  loginContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
    fontFamily: 'Arial, sans-serif',
  },
  loginCard: {
    display: 'flex',
    width: '900px',
    height: '600px',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
  },
  leftSide: {
    flex: 1,
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    boxSizing: 'border-box',
  },
  rightSide: {
    flex: 1,
    background: 'linear-gradient(135deg, #0b367a 0%, #0f4392 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'relative',
  },
  welcomeTitle: {
    color: '#00d2c3',
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '40px',
    lineHeight: 1.2,
    whiteSpace: 'pre-line',
  },
  inputContainer: {
    marginBottom: '25px',
  },
  input: {
    width: '100%',
    padding: '15px 20px',
    border: '1px solid #e0e0e0',
    borderRadius: 25,
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  rememberForgot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    fontSize: '14px',
  },
  rememberMe: {
    display: 'flex',
    alignItems: 'center',
    color: '#777',
    cursor: 'pointer',
    fontSize: '16px',
  },
  forgotPassword: {
    color: '#777',
    textDecoration: 'none',
    fontSize: '16px',
  },
  buttonsContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '25px',
  },
  loginButton: {
    flex: 1,
    padding: '15px',
    borderRadius: '25px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    backgroundColor: '#00d2c3',
    color: 'white',
    border: 'none',
  },
  signupButton: {
    flex: 1,
    padding: '15px',
    borderRadius: '25px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: '#00d2c3',
    border: '2px solid #00d2c3',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    color: '#777',
    marginBottom: '25px',
    position: 'relative',
    justifyContent: 'center',
  },
  dividerText: {
    backgroundColor: 'white',
    padding: '0 10px',
    fontSize: '16px',
    position: 'relative',
    zIndex: 1,
  },
  socialLogin: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  googleBtnContainer: {
    width: '100%',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facebookBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15px',
    borderRadius: '25px',
    fontSize: '16px',
    cursor: 'pointer',
    border: '1px solid #4267B2',
    backgroundColor: 'white',
    color: '#4267B2',
    height: '50px',
  },
  socialIcon: {
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '10px',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  socialButtonText: {
    fontSize: '16px',
  },
  logo: {
    position: 'absolute',
    top: '30px',
    right: '30px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '20px',
  },
};

export default Login;