'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { parseEther, isAddress } from 'viem'
import { baseSepolia } from 'viem/chains'
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from '@coinbase/onchainkit/transaction'
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet'
import {
  Avatar,
  Name,
  Identity,
  Address,
} from '@coinbase/onchainkit/identity'
import { useAccount } from 'wagmi'

const Providers = dynamic(() => import('./providers').then(m => m.default))

const AMOUNTS = [
  { label: '☕ Coffee', value: '0.001' },
  { label: '🍕 Pizza', value: '0.005' },
  { label: '🎉 Celebrate', value: '0.01' },
  { label: '🚀 Big love', value: '0.05' },
]

function TipJarApp() {
  const { address } = useAccount()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('0.001')
  const [note, setNote] = useState('')

  const isValid = recipient.endsWith('.base.eth') ||
    recipient.endsWith('.eth') ||
    isAddress(recipient)

  const calls = isValid && address
    ? [{
      to: recipient as `0x${string}`,
      value: parseEther(amount),
      data: '0x' as `0x${string}`,
    }]
    : []

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: 'var(--font-geist-sans, sans-serif)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '8px',
          }}>🫙</div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: 'white',
            margin: '0 0 6px',
            letterSpacing: '-0.5px',
          }}>Tip Jar</h1>
          <p style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: '14px',
            margin: 0,
          }}>Send ETH to anyone on Base — instantly</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}>

          {/* Wallet */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '24px',
          }}>
            <Wallet>
              <ConnectWallet>
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                </Identity>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>

          {/* Recipient */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              display: 'block',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Send to
            </label>
            <input
              type="text"
              placeholder="0x... or name.base.eth"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: recipient.length > 0 && !isValid
                  ? '1.5px solid #f87171'
                  : '1.5px solid #e5e7eb',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.15s',
                boxSizing: 'border-box',
                color: '#111827',
              }}
            />
            {recipient.length > 0 && !isValid && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>
                Enter a valid address or .base.eth name
              </p>
            )}
          </div>

          {/* Amount presets */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              display: 'block',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Amount
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              marginBottom: '10px',
            }}>
              {AMOUNTS.map(a => (
                <button
                  key={a.value}
                  onClick={() => setAmount(a.value)}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    border: amount === a.value
                      ? '1.5px solid #7c3aed'
                      : '1.5px solid #e5e7eb',
                    background: amount === a.value
                      ? '#f5f3ff'
                      : 'white',
                    color: amount === a.value ? '#6d28d9' : '#374151',
                    fontSize: '13px',
                    fontWeight: amount === a.value ? '600' : '400',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    textAlign: 'left',
                  }}
                >
                  <div>{a.label}</div>
                  <div style={{
                    fontSize: '12px',
                    opacity: 0.7,
                    marginTop: '2px',
                  }}>{a.value} ETH</div>
                </button>
              ))}
            </div>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              step="0.001"
              min="0.001"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #e5e7eb',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                color: '#111827',
              }}
            />
          </div>

          {/* Note */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              display: 'block',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Note <span style={{ fontWeight: 400, textTransform: 'none', opacity: 0.6 }}>(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Thanks for your awesome work! 🙌"
              value={note}
              onChange={e => setNote(e.target.value)}
              maxLength={100}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1.5px solid #e5e7eb',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                color: '#111827',
              }}
            />
          </div>

          {/* Action */}
          {!address ? (
            <div style={{
              textAlign: 'center',
              padding: '14px',
              background: '#f9fafb',
              borderRadius: '12px',
              fontSize: '14px',
              color: '#6b7280',
            }}>
              Connect your wallet above to send a tip
            </div>
          ) : (
            <Transaction chainId={baseSepolia.id} calls={calls}>
              <div style={{
                width: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                opacity: isValid ? 1 : 0.5,
              }}>
                <TransactionButton
                  text={isValid ? `Send ${amount} ETH ✈️` : 'Enter a recipient first'}
                  disabled={!isValid}
                  className="w-full"
                />
              </div>
              <TransactionStatus>
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  background: '#f0fdf4',
                  borderRadius: '12px',
                  fontSize: '13px',
                }}>
                  <TransactionStatusLabel />
                  <TransactionStatusAction />
                </div>
              </TransactionStatus>
            </Transaction>
          )}
        </div>

        <p style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '12px',
          marginTop: '16px',
        }}>
          Powered by Base Sepolia testnet
        </p>
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <Providers>
      <TipJarApp />
    </Providers>
  )
}