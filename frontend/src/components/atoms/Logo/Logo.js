import React from 'react';
import styles from './Logo.scss';
import classNames from 'classnames/bind';
import logo from '../../../static/images/logo.png';

const cx = classNames.bind(styles);

// 

const Logo = () => {
    return (
        <div className={cx('text')}>
            <img className={cx('logo')} src={logo} alt="logo" />&nbsp;coinmarket
        </div>
    );
};

export default Logo;