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
  { label: ' Coffee', value: '0.001' },
  { label: ' Pizza', value: '0.005' },
  { label: ' Celebrate', value: '0.01' },
  { label: ' Big love', value: '0.05' },
]

function JarSVG() {
  return (
    <svg width="120" height="130" viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Lid */}
      <rect x="28" y="10" width="64" height="18" rx="6" fill="#0052FF" />
      <rect x="24" y="22" width="72" height="8" rx="3" fill="#0f3bbf" />
      {/* Jar body */}
      <rect x="22" y="30" width="76" height="80" rx="14" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
      {/* Shine */}
      <rect x="30" y="38" width="10" height="40" rx="5" fill="#f0f4ff" opacity="0.8" />
      {/* Heart */}
      <path d="M60 95 C60 95 38 80 38 65 C38 57 44 52 50 52 C54 52 57.5 54 60 57 C62.5 54 66 52 70 52 C76 52 82 57 82 65 C82 80 60 95 60 95Z" fill="#0052FF" opacity="0.15" />
      <path d="M60 88 C60 88 42 75 42 63 C42 57 47 53 52 53 C55.5 53 58 55 60 58 C62 55 64.5 53 68 53 C73 53 78 57 78 63 C78 75 60 88 60 88Z" fill="#0052FF" />
      {/* Coins */}
      <ellipse cx="45" cy="97" rx="10" ry="5" fill="#0052FF" opacity="0.2" />
      <ellipse cx="60" cy="100" rx="10" ry="5" fill="#0052FF" opacity="0.2" />
      <ellipse cx="75" cy="97" rx="10" ry="5" fill="#0052FF" opacity="0.2" />
      {/* Sparkles */}
      <text x="10" y="55" fontSize="14" fill="#0052FF" opacity="0.4">+</text>
      <text x="102" y="60" fontSize="14" fill="#0052FF" opacity="0.4">+</text>
      <text x="8" y="80" fontSize="10" fill="#0052FF" opacity="0.3">✦</text>
      <text x="105" y="85" fontSize="10" fill="#0052FF" opacity="0.3">✦</text>
    </svg>
  )
}

function TipModal({ onClose }: { onClose: () => void }) {
  const { address } = useAccount()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('0.001')
  const [note, setNote] = useState('')

  const isValid = recipient.endsWith('.base.eth') ||
    recipient.endsWith('.eth') ||
    isAddress(recipient)

  const calls = isValid && address
    ? [{ to: recipient as `0x${string}`, value: parseEther(amount), data: '0x' as `0x${string}` }]
    : []

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50, padding: '1rem',
    }}
      onClick={onClose}
    >
      <div style={{
        background: 'white', borderRadius: '20px',
        padding: '28px', width: '100%', maxWidth: '400px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.15)',
      }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Send a Tip</h2>
          <button onClick={onClose} style={{
            border: 'none', background: '#f1f5f9', borderRadius: '50%',
            width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', color: '#64748b',
          }}>×</button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recipient
          </label>
          <input
            type="text"
            placeholder="0x... or name.base.eth"
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
            style={{
              width: '100%', padding: '11px 14px', borderRadius: '10px', boxSizing: 'border-box',
              border: recipient.length > 0 && !isValid ? '1.5px solid #f87171' : '1.5px solid #e2e8f0',
              fontSize: '14px', outline: 'none', color: '#0f172a',
            }}
          />
          {recipient.length > 0 && !isValid && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', marginBottom: 0 }}>Enter a valid address or .base.eth name</p>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Amount
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            {AMOUNTS.map(a => (
              <button key={a.value} onClick={() => setAmount(a.value)} style={{
                padding: '9px 12px', borderRadius: '10px', textAlign: 'left', cursor: 'pointer',
                border: amount === a.value ? '1.5px solid #0052FF' : '1.5px solid #e2e8f0',
                background: amount === a.value ? '#e8f0ff' : 'white',
                color: amount === a.value ? '#0052FF' : '#374151',
                fontSize: '13px', fontWeight: amount === a.value ? '600' : '400',
                transition: 'all 0.1s',
              }}>
                <div>{a.label}</div>
                <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '1px' }}>{a.value} ETH</div>
              </button>
            ))}
          </div>
          <input
            type="number" value={amount} onChange={e => setAmount(e.target.value)}
            step="0.001" min="0.001"
            style={{
              width: '100%', padding: '11px 14px', borderRadius: '10px', boxSizing: 'border-box',
              border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', color: '#0f172a',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Note <span style={{ fontWeight: 400, textTransform: 'none' }}>(optional)</span>
          </label>
          <input
            type="text" placeholder="Thanks for your awesome work!"
            value={note} onChange={e => setNote(e.target.value)} maxLength={100}
            style={{
              width: '100%', padding: '11px 14px', borderRadius: '10px', boxSizing: 'border-box',
              border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none', color: '#0f172a',
            }}
          />
        </div>

        {!address ? (
          <div style={{ textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: '10px', fontSize: '13px', color: '#64748b' }}>
            Connect your wallet to send a tip
          </div>
        ) : (
          <Transaction chainId={baseSepolia.id} calls={calls}>
            <div style={{ borderRadius: '10px', overflow: 'hidden', opacity: isValid ? 1 : 0.5 }}>
              <TransactionButton
                text={isValid ? `Send ${amount} ETH ✈️` : 'Enter a recipient first'}
                disabled={!isValid}
                className="w-full"
              />
            </div>
            <TransactionStatus>
              <div style={{ marginTop: '10px', padding: '10px 12px', background: '#f0fdf4', borderRadius: '10px', fontSize: '13px' }}>
                <TransactionStatusLabel />
                <TransactionStatusAction />
              </div>
            </TransactionStatus>
          </Transaction>
        )}
      </div>
    </div>
  )
}

function TipJarApp() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'white',
      fontFamily: 'sans-serif',
    }}>

      {/* Top navbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 32px',
        borderBottom: '1px solid #f1f5f9',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="32" height="32" viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="55.5" cy="55.5" r="55.5" fill="#0052FF" />
            <path d="M55.7 78.3C68.3 78.3 78.5 68.1 78.5 55.5C78.5 42.9 68.3 32.7 55.7 32.7C43.7 32.7 33.9 41.9 32.9 53.7H63.1V57.3H32.9C33.9 69.1 43.7 78.3 55.7 78.3Z" fill="white" />
          </svg>
          <span style={{ fontWeight: '600', fontSize: '15px', color: '#0f172a' }}>Base Tip Jar</span>
        </div>
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

      {/* Hero */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: '64px', paddingBottom: '48px', textAlign: 'center', padding: '64px 24px 48px',
      }}>

        {/* Built on Base badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: '#e8f0ff', borderRadius: '20px', padding: '5px 14px',
          fontSize: '12px', color: '#0052FF', fontWeight: '500', marginBottom: '20px',
        }}>
          <svg width="14" height="14" viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="55.5" cy="55.5" r="55.5" fill="#0052FF" />
            <path d="M55.7 78.3C68.3 78.3 78.5 68.1 78.5 55.5C78.5 42.9 68.3 32.7 55.7 32.7C43.7 32.7 33.9 41.9 32.9 53.7H63.1V57.3H32.9C33.9 69.1 43.7 78.3 55.7 78.3Z" fill="white" />
          </svg>
          Built on Base
        </div>

        {/* Title */}
        <span style={{ fontSize: '20px', marginBottom: '8px', display: 'block' }}></span>
        <h1 style={{
          fontSize: '52px', fontWeight: '800', color: '#0f172a',
          margin: '0 0 12px', letterSpacing: '-1.5px', lineHeight: 1.1,
        }}>
          Tip Jar
        </h1>
        <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.7', margin: '0 0 40px' }}>
          Send a tip. Show some love.<br />Every tip means a lot!
        </p>

        {/* Jar */}
        <div style={{ marginBottom: '40px' }}>
          <JarSVG />
        </div>

        {/* CTA */}
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '16px 48px', borderRadius: '14px',
            background: '#0052FF', color: 'white', border: 'none',
            fontSize: '16px', fontWeight: '600', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            transition: 'opacity 0.15s', marginBottom: '16px',
          }}
          onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseOut={e => (e.currentTarget.style.opacity = '1')}
        >
          Send a Tip
        </button>

        <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
          Secure. Onchain. Transparent.
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: '0',
        borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9',
        maxWidth: '480px', margin: '0 auto',
      }}>
        {[
          { icon: '', value: '0', label: 'Total Tippers' },
          { icon: '', value: '0 ETH', label: 'Total Tipped' },
          { icon: '', value: '0', label: 'Total Tips' },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center', padding: '20px 16px',
            borderRight: i < 2 ? '1px solid #f1f5f9' : 'none',
          }}>
            <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.icon}</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {showModal && <TipModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

export default function Home() {
  return (
    <Providers>
      <TipJarApp />
    </Providers>
  )
}