import React from 'react';
import { UserProfile } from '../types';

// AuthScreen is currently unused in the Web version.
// Authentication is handled via local storage or disabled for quick play.

interface AuthScreenProps {
  onLogin: (user: UserProfile) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  return null;
};

export default AuthScreen;