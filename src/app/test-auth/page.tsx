import AuthTest from '@/components/AuthTest'
import { MatrixRain } from '@/components/ui'

export default function TestAuthPage() {
  return (
    <div className="min-h-screen bg-black text-[#00ff41] p-8 relative">
      <MatrixRain intensity="low" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Authentication Testing</h1>
          <p className="text-gray-400">Test login and registration functionality</p>
        </div>
        
        <AuthTest />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Auth Test - TaSave',
  description: 'Test authentication functionality'
}