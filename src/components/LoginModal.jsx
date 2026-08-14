import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../AuthContext';

const FALCON_VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260813_052122_e77a27e6-17f1-4794-889b-3ceaa0e9e8cb.mp4";

export const LoginModal = ({ onClose }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(null);

  const { signInWithGoogle, signInWithEmail, signUpWithEmail, user } = useAuth();

  const stageRef = useRef(null);
  const cardRef = useRef(null);
  const cardInRef = useRef(null);
  const photoRef = useRef(null);
  const paneRef = useRef(null);

  useEffect(() => {
    // Layout Constants
    var REF_W = 1464, PANE_W = 628, CARD_W = 613;
    var CONTENT_H = 697;
    var PANE_RATIO = PANE_W / REF_W;

    var mqLandscape = window.matchMedia('(min-width:700px) and (min-aspect-ratio:51/50)');

    function photoRatio(vw) {
      if (vw >= 1280) return 1 - PANE_RATIO;
      if (vw >= 1000) return 0.571038 - (1280 - vw) * (0.571038 - 0.42) / 280;
      if (vw >= 820) return 0.42 - (1000 - vw) * (0.42 - 0.36) / 180;
      return 0.36;
    }

    function clearInline() {
      if (photoRef.current) photoRef.current.style.cssText = '';
      if (paneRef.current) paneRef.current.style.cssText = '';
      if (cardRef.current) cardRef.current.style.cssText = '';
      if (cardInRef.current) cardInRef.current.style.cssText = '';
    }

    function layout() {
      clearInline();
      var vw = window.innerWidth;
      var vh = window.innerHeight;

      if (mqLandscape.matches) {
        document.body.classList.remove('stacked', 'tabport');
        document.body.classList.add('land');

        var pr = photoRatio(vw);
        var paneW = vw * (1 - pr);

        if (photoRef.current) photoRef.current.style.width = (pr * 100) + '%';
        if (paneRef.current) paneRef.current.style.left = (pr * 100) + '%';

        var cs = Math.min(paneW / PANE_W, vh / CONTENT_H);
        var gapL = 1 * cs, mT = 14 * cs, mB = 13 * cs, mR = 14 * cs;
        var cw = Math.max(CARD_W * cs, paneW - gapL - mR);
        var ch = vh - mT - mB;

        if (cardRef.current) {
          cardRef.current.style.width = cw + 'px';
          cardRef.current.style.height = ch + 'px';
          cardRef.current.style.borderRadius = (26 * cs) + 'px';
          cardRef.current.style.borderWidth = Math.max(1, cs) + 'px';
        }

        if (cardInRef.current) {
          cardInRef.current.style.transform = 'translate(' + ((cw - CARD_W * cs) / 2) + 'px,0) scale(' + cs + ')';
        }
      } else if (vw >= 700) {
        document.body.classList.remove('stacked', 'land');
        document.body.classList.add('tabport');
      } else {
        document.body.classList.remove('land', 'tabport');
        document.body.classList.add('stacked');
      }
    }

    layout();
    window.addEventListener('resize', layout);
    window.addEventListener('orientationchange', layout);

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && Element.prototype.animate) {
      const ease = 'cubic-bezier(.16,1,.3,1)';
      const softEase = 'cubic-bezier(.22,1,.36,1)';
      const compact = window.matchMedia('(max-width:699px)').matches;

      const anims = [
        { sel: '#signal-card', delay: 40, dur: 820, ease, from: { opacity: 0, transform: compact ? 'translateY(14px)' : 'translateY(12px) scale(.988)' } },
        { sel: '#h1', delay: 270, dur: 620, ease, from: { opacity: 0, transform: 'translateY(10px)' } },
        { sel: '#sub', delay: 370, dur: 560, ease, from: { opacity: 0, transform: 'translateY(10px)' } },
        { sel: '#name', delay: 480, dur: 520, ease: softEase, from: { opacity: 0, transform: 'translateY(8px)' } },
        { sel: '#email', delay: 540, dur: 520, ease: softEase, from: { opacity: 0, transform: 'translateY(8px)' } },
        { sel: '#pw', delay: 600, dur: 520, ease: softEase, from: { opacity: 0, transform: 'translateY(8px)' } },
        { sel: '#loginBtn', delay: 720, dur: 560, ease, from: { opacity: 0, transform: 'translateY(8px)' } },
        { sel: '.divider', delay: 840, dur: 440, ease: softEase, from: { opacity: 0, transform: 'translateY(6px)' } },
        { sel: '#gBtn', delay: 920, dur: 540, ease, from: { opacity: 0, transform: 'translateY(8px)' } },
        { sel: '#bottom', delay: 1000, dur: 500, ease: softEase, from: { opacity: 0, transform: 'translateY(6px)' } }
      ];

      anims.forEach(({ sel, delay, dur, ease: easing, from }) => {
        const el = document.querySelector(sel);
        if (el) {
          const to = { opacity: 1, transform: 'none' };
          el.animate([from, to], { delay, duration: dur, easing, fill: 'both' });
        }
      });
    }

    return () => {
      window.removeEventListener('resize', layout);
      window.removeEventListener('orientationchange', layout);
      document.body.classList.remove('land', 'tabport', 'stacked');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (isRegisterMode) {
      const { error } = await signUpWithEmail(email, password, fullName);
      if (error) setAuthError(error.message);
      else onClose();
    } else {
      const { error } = await signInWithEmail(email, password);
      if (error) setAuthError(error.message);
      else onClose();
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    await signInWithGoogle();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#fefefe',
        zIndex: 100,
        overflow: 'hidden'
      }}
    >
      {/* Close Button */}
      <button 
        onClick={onClose}
        aria-label="Close modal"
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          zIndex: 120,
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          fontSize: '20px',
          fontWeight: '300',
          transition: 'transform 0.15s ease, background-color 0.15s ease'
        }}
        className="close-modal-btn"
      >
        ✕
      </button>

      <div className="stage" ref={stageRef}>
        {/* Left Video Media Panel */}
        <section className="photo" ref={photoRef}>
          <video className="photo-img photo-img--tall" autoPlay muted loop playsInline preload="auto">
            <source src={FALCON_VIDEO_URL} type="video/mp4" />
          </video>
          <video className="photo-img photo-img--wide" aria-hidden="true" autoPlay muted loop playsInline preload="auto">
            <source src={FALCON_VIDEO_URL} type="video/mp4" />
          </video>
          <div className="scrim"></div>
        </section>

        {/* Right Form Pane */}
        <section className="pane" ref={paneRef}>
          <div className="card" id="signal-card" ref={cardRef}>
            <div className="card-in" id="cardIn" ref={cardInRef}>
              <h1 className="col center" id="h1">
                {isRegisterMode ? "Create Account" : "Welcome Back!"}
              </h1>
              <p className="col center" id="sub">
                {isRegisterMode ? (
                  <><b>Sign up</b> to start monitoring your signals for free.</>
                ) : (
                  <><b>Log in</b> to continue monitoring your signals.</>
                )}
              </p>

              {authError && (
                <div style={{ color: '#ea4335', fontSize: '13px', textAlign: 'center', margin: '10px 0', fontWeight: 600 }}>
                  {authError}
                </div>
              )}

              {/* Full Name Field */}
              {isRegisterMode && (
                <div className="field" id="name" style={{ top: '170px', height: '52px', background: '#fafafa', border: '1.5px solid #acacae' }}>
                  <input 
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                    aria-label="Full Name"
                  />
                </div>
              )}

              {/* Email Field */}
              <div 
                className="field" 
                id="email"
                style={{ 
                  top: isRegisterMode ? '232px' : '203px', 
                  height: isRegisterMode ? '52px' : '61px',
                  background: '#fafafa',
                  border: '1.5px solid #acacae'
                }}
              >
                <input 
                  type="email"
                  placeholder="Eg. johndoe@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  aria-label="Email address"
                />
              </div>

              {/* Password Field */}
              <div 
                className="field" 
                id="pw"
                style={{ 
                  top: isRegisterMode ? '294px' : '273.5px', 
                  height: isRegisterMode ? '52px' : '59px',
                  background: '#f9f9f9',
                  border: isRegisterMode ? '1.5px solid #acacae' : 'none'
                }}
              >
                <input 
                  type="password"
                  placeholder={isRegisterMode ? "Create Password" : "Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isRegisterMode ? "new-password" : "current-password"}
                  aria-label="Password"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="button" 
                id="loginBtn"
                onClick={handleSubmit}
                style={{
                  top: isRegisterMode ? '364px' : '366px',
                  height: isRegisterMode ? '58px' : '65.5px'
                }}
              >
                <span>{isRegisterMode ? "Start Free" : "Login"}</span>
                <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
                  <path d="M3 11h15.4M11 3.3l7.7 7.7-7.7 7.7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Divider */}
              <div 
                className="divider"
                style={{ top: isRegisterMode ? '440px' : '477px' }}
              >
                <i></i>
                <b>OR</b>
                <i></i>
              </div>

              {/* Google Sign-in Button */}
              <button 
                type="button" 
                id="gBtn"
                onClick={handleGoogleSignIn}
                style={{
                  top: isRegisterMode ? '490px' : '535px',
                  height: isRegisterMode ? '54px' : '59.5px'
                }}
              >
                <svg width="19" height="19" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.66 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.66 48 24 48z"/>
                </svg>
                <span>Sign in with Google</span>
              </button>

              {/* Footer */}
              <p 
                id="bottom"
                style={{ top: isRegisterMode ? '562px' : '611px' }}
              >
                {isRegisterMode ? (
                  <>
                    Already have an account?{' '}
                    <a 
                      href="#login" 
                      onClick={(e) => {
                        e.preventDefault();
                        setIsRegisterMode(false);
                      }}
                    >
                      Log In
                    </a>
                  </>
                ) : (
                  <>
                    Don&#8217;t have an account?{' '}
                    <a 
                      href="#start-free" 
                      onClick={(e) => {
                        e.preventDefault();
                        setIsRegisterMode(true);
                      }}
                    >
                      Start Free
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
