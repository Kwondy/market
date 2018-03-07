import React, { Component } from 'react';
import { Header } from '../components';
// import redux dependencies
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as baseActions from '../store/modules/base';


class HeaderContainer extends Component {
    
    handleLoginButtonClick = () => {
        const { BaseActions } = this.props;
        BaseActions.setScreenMaskVisibility(true);
    }
    
    render() {
        const { handleLoginButtonClick } = this;
        return (
            <Header 
                onLoginButtonClick={handleLoginButtonClick}
            />
        );
    }
}

export default connect(
    (state) => ({
    //   user: state.user.get('user'),
    //   userMenu: state.base.getIn(['header', 'userMenu'])
    }),
    (dispatch) => ({
        BaseActions: bindActionCreators(baseActions, dispatch)
       
    })
)(HeaderContainer);