'use client'

import React from 'react'
import { HackerButton, GlowCard } from './ui'
import { AlertTriangle } from 'lucide-react'

interface AuthErrorBoundaryProps {
  children: React.ReactNode
}

interface AuthErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export default class AuthErrorBoundary extends React.Component<
  AuthErrorBoundaryProps,
  AuthErrorBoundaryState
> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Auth error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <GlowCard className="max-w-md w-full text-center" glowColor="#ff6b6b">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              Authentication Error
            </h2>
            <p className="text-gray-400 mb-6">
              {this.state.error?.message || 'An unexpected error occurred during authentication.'}
            </p>
            <div className="space-y-3">
              <HackerButton
                variant="destructive"
                onClick={() => window.location.href = '/auth'}
                className="w-full"
              >
                Try Again
              </HackerButton>
              <HackerButton
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Go Home
              </HackerButton>
            </div>
          </GlowCard>
        </div>
      )
    }

    return this.props.children
  }
}