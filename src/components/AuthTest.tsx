'use client'

import { useState } from 'react'
import { HackerButton, GlowCard, Badge, TerminalWindow } from './ui'
import { Terminal, User, Lock } from 'lucide-react'

export default function AuthTest() {
  const [testResult, setTestResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const testLogin = async () => {
    setIsLoading(true)
    setTestResult('Testing login...')
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin',
          password: 'admin123'
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setTestResult(`✅ Login successful! Welcome ${data.user.username}`)
      } else {
        setTestResult(`❌ Login failed: ${data.error}`)
      }
    } catch (error) {
      setTestResult(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testRegister = async () => {
    setIsLoading(true)
    setTestResult('Testing registration...')
    
    const randomUsername = `testuser_${Date.now()}`
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: randomUsername,
          password: 'testpass123'
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setTestResult(`✅ Registration successful! User ${data.user.username} created`)
      } else {
        setTestResult(`❌ Registration failed: ${data.error}`)
      }
    } catch (error) {
      setTestResult(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GlowCard className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#00ff41] mb-2 flex items-center justify-center">
          <Terminal className="w-6 h-6 mr-2" />
          Authentication Test Panel
        </h2>
        <Badge variant="info">Development Mode</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <HackerButton
          variant="matrix"
          onClick={testLogin}
          disabled={isLoading}
          className="w-full"
          glitchEffect
        >
          <User className="w-4 h-4 mr-2" />
          Test Admin Login
        </HackerButton>

        <HackerButton
          variant="default"
          onClick={testRegister}
          disabled={isLoading}
          className="w-full"
        >
          <Lock className="w-4 h-4 mr-2" />
          Test Registration
        </HackerButton>
      </div>

      {testResult && (
        <TerminalWindow title="test@auth-system:~$" showControls={false}>
          <div className="space-y-1">
            <div className="flex">
              <span className="text-[#00ff41] mr-2">$</span>
              <span>auth-test --verbose</span>
            </div>
            <div className={`ml-4 ${testResult.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
              {testResult}
            </div>
            {isLoading && (
              <div className="ml-4 text-yellow-400">
                <span className="animate-pulse">Processing...</span>
              </div>
            )}
          </div>
        </TerminalWindow>
      )}

      <div className="mt-6 text-xs text-gray-400 text-center">
        <p>Default credentials: admin / admin123</p>
        <p>Registration creates random test users</p>
      </div>
    </GlowCard>
  )
}