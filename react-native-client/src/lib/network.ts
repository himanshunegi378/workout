import { onlineManager } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';

let isSimulatedOffline = false;
let unsubscribeNetInfo: (() => void) | null = null;

/**
 * Initializes NetInfo event listeners and bridges connection status to the query client.
 */
export function initNetworkListener(): void {
  if (unsubscribeNetInfo) return;

  onlineManager.setEventListener((setOnline) => {
    unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      if (!isSimulatedOffline) {
        setOnline(!!state.isConnected);
      }
    });

    return () => {
      if (unsubscribeNetInfo) {
        unsubscribeNetInfo();
        unsubscribeNetInfo = null;
      }
    };
  });
}

/**
 * Sets simulated offline override state. Forces the onlineManager offline
 * or restores it based on live NetInfo state.
 */
export function setSimulatedOffline(offline: boolean): void {
  isSimulatedOffline = offline;
  if (offline) {
    onlineManager.setOnline(false);
  } else {
    NetInfo.fetch().then((state) => {
      onlineManager.setOnline(!!state.isConnected);
    });
  }
}

/**
 * Returns whether simulated offline mode is currently active.
 */
export function getIsSimulatedOffline(): boolean {
  return isSimulatedOffline;
}
