import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAction, type ActionAdapter } from '@dialectlabs/blinks';
import { Blink } from '@dialectlabs/blinks-react-native';
import { PublicKey, Transaction } from '@solana/web3.js';
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol';


function getWalletAdapter(): ActionAdapter {
  return {
    connect: async (_context) => {
      try {
        const publicKey = await transact(async (wallet) => {
          const { accounts } = await wallet.authorize({
            cluster: 'devnet', // Specify the network cluster, e.g., 'devnet'
            identity: {
              name: "My DApp",
              uri: "https://my-dapp.example.com",
              icon: "https://my-dapp.example.com/icon.png",
            },
          });

          if (accounts.length === 0) {
            throw new Error('No accounts found');
          }
          return accounts[0].address;
        });

        return publicKey;
      } catch (error) {
        console.error('Failed to connect to wallet:', error);
        throw error;
      }
    },
    signTransaction: async (_tx, _context) => {
      try {
        const signedPayloads = await transact(async (wallet) => {
          const transaction = Transaction.from(Buffer.from(_tx, 'base64'));
          const { signatures } = await wallet.signAndSendTransactions({
            payloads: [transaction.serialize().toString('base64')],
          });
          return signatures[0]; // Assuming signatures array exists and contains the transaction signature
        });

        return {
          signature: signedPayloads || 'Failed to sign the transaction',
        };
      } catch (error) {
        console.error('Failed to sign transaction:', error);
        throw error;
      }
    },
    confirmTransaction: async (signature, _context) => {
      try {
        // The wallet handles transaction submission, so we simply log the signature.
        console.log('Transaction confirmed with signature:', signature);
      } catch (error) {
        console.error('Failed to confirm transaction:', error);
        throw error;
      }
    },
    metadata: {
      supportedBlockchainIds: ['solana'],
    },
  };
}

export const BlinkRenderer: React.FC<{ url: string }> = ({ url }) => {
  const adapter = getWalletAdapter();
  const { action } = useAction({ url, adapter });

  if (!action) {
    return (
      <View style={styles.placeholder}>
        <Text>Loading Blink...</Text>
      </View>
    );
  }

  const actionUrl = new URL(url);
  return (
    <Blink
  theme={{
    '--blink-bg-primary': '#202327',
    '--blink-button': '#1d9bf0',
    '--blink-button-disabled': '#2f3336',
    '--blink-button-success': '#00ae661a',
    '--blink-icon-error': '#ff6565',
    '--blink-icon-primary': '#6e767d',
    '--blink-icon-warning': '#ffb545',
    '--blink-input-bg': '#202327',
    '--blink-input-stroke': '#3d4144',
    '--blink-input-stroke-disabled': '#2f3336',
    '--blink-input-stroke-error': '#ff6565',
    '--blink-input-stroke-selected': '#1d9bf0',
    '--blink-stroke-error': '#ff6565',
    '--blink-stroke-primary': '#1d9bf0',
    '--blink-stroke-secondary': '#3d4144',
    '--blink-stroke-warning': '#ffb545',
    '--blink-text-brand': '#35aeff',
    '--blink-text-button': '#ffffff',
    '--blink-text-button-disabled': '#768088',
    '--blink-text-button-success': '#12dc88',
    '--blink-text-error': '#ff6565',
    '--blink-text-input': '#ffffff',
    '--blink-text-input-disabled': '#566470',
    '--blink-text-input-placeholder': '#6e767d',
    '--blink-text-link': '#6e767d',
    '--blink-text-primary': '#ffffff',
    '--blink-text-secondary': '#949ca4',
    '--blink-text-success': '#12dc88',
    '--blink-text-warning': '#ffb545',
    '--blink-transparent-error': '#aa00001a',
    '--blink-transparent-grey': '#6e767d1a',
    '--blink-transparent-warning': '#a966001a',
    '--blink-border-radius-rounded-lg': 0.25,
    '--blink-border-radius-rounded-xl': 0.5,
    '--blink-border-radius-rounded-2xl': 1.125,
    '--blink-border-radius-rounded-button': 624.9375,
    '--blink-border-radius-rounded-input': 624.9375,
  }}
  action={action}
  websiteUrl={actionUrl.href}
  websiteText={actionUrl.hostname}
/>

  );
};

const styles = StyleSheet.create({
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
