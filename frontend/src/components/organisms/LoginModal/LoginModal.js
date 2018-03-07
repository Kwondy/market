import React from 'react';
import styles from './LoginModal.scss';
import classNames from 'classnames/bind';
import { Modal, Input, Button, TextButton, SocialLoginButton, InputError } from '../../../components';

const cx = classNames.bind(styles);

const LoginModal = ({
  visible, 
  mode,
  forms,
  error,
  onChangeInput, 
  onChangeMode,
  onLogin,
  onRegister,
  onSocialLogin,
  onClose,
  onKeyPress
}) => {
  const isLogin = mode === 'login';
  const modeText = isLogin ? 'login' : 'register';
  const invertedText = isLogin ? 'register' : 'login';

  const {
    email,
    password
  } = forms.toJS();

  const {
    email: emailError,
    password: passwordError,
    localLogin: localLoginError
  } = error ? error.toJS() : { };

  const onButtonClick = isLogin ? onLogin : onRegister;

  return (
    <Modal visible={visible} mobileFullscreen>
      <div className={cx('login-modal')}>
        <div className={cx('bar')}></div>
        <div className={cx('close')} onClick={onClose}>✕</div>
        <div className={cx('content')}>
          <h3>Email {modeText}</h3>
          <InputError error={localLoginError} noMarginTop/>
          <div className={cx('form')}>
            <Input
              value={email} 
              onChangeInput={onChangeInput}
              name="email" 
              fullWidth big 
              placeholder="email"/>
              <InputError error={emailError}/>
            <Input 
              value={password}
              onChangeInput={onChangeInput}
              name="password" 
              fullWidth big 
              placeholder="password" 
              type="password"
              onKeyPress={onKeyPress}/>
              <InputError error={passwordError}/>
          </div>
          <Button 
            flat color="teal" 
            flex padding="0.6rem" 
            className={cx('login')}>Log in</Button>
          <div className={cx('login-foot')}>
            <TextButton>Find Password</TextButton>
            <TextButton right onClick={onChangeMode}>{invertedText}</TextButton>
          </div>
          <div className={cx('separator')}>
            <div className={cx('or')}>OR</div>
          </div>
          <h3>Social {modeText}</h3>
          <SocialLoginButton onSocialLogin={onSocialLogin}/>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;