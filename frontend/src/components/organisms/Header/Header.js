import React from 'react';
import styles from './Header.scss';
import ClassNames from 'classnames/bind';
import { Logo, HeaderNav, Button } from '../../../components'; 

const cx = ClassNames.bind(styles);

const Header = ({
    onLoginButtonClick
}) => {
    return (
        <div className={cx('header')}>
            <div className={cx('responsive')}>
               <div className={cx('logo-wrapper')}> 
                    <Logo/>
               </div>
               <div className={cx('right-side')}>
                    <HeaderNav/>
                    <Button 
                        invert
                        className={cx('login-button')}
                        onClick={onLoginButtonClick}>Log in</Button>
               </div>
            </div>
        </div>
    );
};

export default Header;