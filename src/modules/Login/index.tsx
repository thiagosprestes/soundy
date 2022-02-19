import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { GoogleSignin } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import LoginContainer from './container';
import { storeUserData } from './slices/user';
import { firebaseClientId } from '../../config/environmentVariables';
import { ComponentState } from '../../utils/globalTypes';

const Login = () => {
  const [componentState, setComponentState] = useState(ComponentState.default);

  const dispatch = useDispatch();

  const handleOnLogin = async () => {
    try {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      const googleAuthResponse = await auth().signInWithCredential(
        googleCredential,
      );

      dispatch(storeUserData(googleAuthResponse.user));
    } catch (error) {
      setComponentState(ComponentState.error);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: firebaseClientId,
    });
  }, []);

  return (
    <LoginContainer
      componentState={componentState}
      onLogin={handleOnLogin}
      onRetry={handleOnLogin}
    />
  );
};
export default Login;
