import { useEffect, useRef, useState } from 'react';
import { useAuth } from './api/use-auth';
import { sessionStorageService } from '~/api-services/session-storage.service';
import { TokenUtils } from '~/api-services/token.utils';
import { toast } from 'sonner';

interface UseSessionOptions {
  // Warn user N minutes before expiration
  warningThresholdMinutes?: number;
  // Auto logout if inactive for N minutes
  inactivityTimeoutMinutes?: number;
  // Check expiration every N milliseconds
  checkIntervalMs?: number;
}

export function useSession(options: UseSessionOptions = {}) {
  const {
    warningThresholdMinutes = 5,
    inactivityTimeoutMinutes = 30,
    checkIntervalMs = 60000, // Check every minute
  } = options;

  const { signOut } = useAuth();
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number>(0);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const warningShownRef = useRef<boolean>(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset inactivity timer
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      handleInactivityLogout();
    }, inactivityTimeoutMinutes * 60 * 1000);
  };

  // Handle inactivity logout
  const handleInactivityLogout = async () => {
    toast.error('You have been logged out due to inactivity');
    await signOut();
  };

  // Check token expiration
  const checkTokenExpiration = () => {
    const tokens = sessionStorageService.getTokens();
    if (!tokens) return;

    const accessTokenExpiry = TokenUtils.getTimeUntilExpiry(tokens.accessToken);
    const refreshTokenExpiry = TokenUtils.getTimeUntilExpiry(tokens.refreshToken);

    // Use whichever expires first
    const timeUntilExpiry = Math.min(accessTokenExpiry, refreshTokenExpiry);
    setTimeUntilExpiry(timeUntilExpiry);

    // Show warning if approaching expiration
    if (timeUntilExpiry <= warningThresholdMinutes * 60 * 1000) {
      if (!warningShownRef.current) {
        setShowWarning(true);
        warningShownRef.current = true;

        const minutes = Math.ceil(timeUntilExpiry / 60000);
        toast.warning(`Your session will expire in ${minutes} minute${minutes !== 1 ? 's' : ''}. Please save your work.`);
      }
    } else {
      setShowWarning(false);
      warningShownRef.current = false;
    }

    // Auto logout if token is expired
    if (timeUntilExpiry <= 0) {
      handleAutoLogout();
    }
  };

  // Handle automatic logout
  const handleAutoLogout = async () => {
    toast.error('Your session has expired. Please sign in again.');
    await signOut();
  };

  useEffect(() => {
    // Set up activity listeners
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    const handleActivity = () => {
      sessionStorageService.updateLastActivity();
      resetInactivityTimer();
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Start inactivity timer
    resetInactivityTimer();

    // Check expiration periodically
    const expirationInterval = setInterval(checkTokenExpiration, checkIntervalMs);

    // Initial check
    checkTokenExpiration();

    return () => {
      // Cleanup
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      clearInterval(expirationInterval);
    };
  }, []);

  return {
    timeUntilExpiry,
    showWarning,
    isSessionValid: sessionStorageService.isSessionValid(),
    sessionDuration: sessionStorageService.getSessionDuration(),
    lastActivity: sessionStorageService.getLastActivity(),
  };
}

