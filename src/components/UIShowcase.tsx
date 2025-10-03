'use client'

import { 
  Badge, 
  GlowCard, 
  HackerButton, 
  TerminalWindow, 
  MatrixRain, 
  GlitchText, 
  HolographicCard, 
  CyberGrid 
} from './ui'
import { motion } from 'framer-motion'
import { Terminal, Zap, Shield, Code, Database, Cpu } from 'lucide-react'

export default function UIShowcase() {
  return (
    <div className="min-h-screen bg-black text-[#00ff41] p-8 relative overflow-hidden">
      {/* Matrix Rain Background */}
      <MatrixRain intensity="low" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <GlitchText 
            className="text-4xl md:text-6xl font-bold mb-4"
            intensity="medium"
            trigger="auto"
          >
            TASAVE UI COMPONENTS
          </GlitchText>
          <p className="text-xl text-gray-400">
            Componentes modernos con estilo hacker/cyberpunk
          </p>
        </motion.div>

        {/* Badges Section */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6 terminal-text">Badges</h2>
          <div className="flex flex-wrap gap-4">
            <Badge variant="default">Sistema Activo</Badge>
            <Badge variant="success">Conexión Segura</Badge>
            <Badge variant="warning">Alerta</Badge>
            <Badge variant="destructive">Error Crítico</Badge>
            <Badge variant="info">Información</Badge>
            <Badge variant="outline">Modo Terminal</Badge>
          </div>
        </motion.section>

        {/* Buttons Section */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6 terminal-text">Hacker Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <HackerButton variant="default">
              <Terminal className="w-4 h-4 mr-2" />
              Acceder Sistema
            </HackerButton>
            <HackerButton variant="matrix" glitchEffect>
              <Code className="w-4 h-4 mr-2" />
              Ejecutar Código
            </HackerButton>
            <HackerButton variant="destructive">
              <Shield className="w-4 h-4 mr-2" />
              Modo Seguro
            </HackerButton>
            <HackerButton variant="outline" size="lg">
              <Database className="w-4 h-4 mr-2" />
              Base de Datos
            </HackerButton>
          </div>
        </motion.section>

        {/* Cards Grid */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6 terminal-text">Cards Showcase</h2>
          
          <CyberGrid columns={3} gap={6}>
            <GlowCard intensity="medium">
              <div className="flex items-center mb-4">
                <Cpu className="w-8 h-8 mr-3 text-[#00ff41]" />
                <h3 className="text-xl font-bold">Glow Card</h3>
              </div>
              <p className="text-gray-400">
                Tarjeta con efectos de brillo y animaciones suaves.
              </p>
            </GlowCard>

            <HolographicCard>
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 mr-3 text-[#00ff41]" />
                <h3 className="text-xl font-bold">Holographic Card</h3>
              </div>
              <p className="text-gray-400">
                Tarjeta con efectos holográficos 3D interactivos.
              </p>
            </HolographicCard>

            <GlowCard glowColor="#ff6b6b" intensity="high">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 mr-3 text-red-400" />
                <h3 className="text-xl font-bold text-red-400">Alert Card</h3>
              </div>
              <p className="text-gray-400">
                Tarjeta con brillo personalizado para alertas.
              </p>
            </GlowCard>
          </CyberGrid>
        </motion.section>

        {/* Terminal Window */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-6 terminal-text">Terminal Window</h2>
          
          <TerminalWindow title="root@tasave-system:~$" showControls>
            <div className="space-y-2">
              <div className="flex">
                <span className="text-[#00ff41] mr-2">$</span>
                <span>sudo access-system --mode=demo</span>
              </div>
              <div className="text-gray-400">
                [INFO] Iniciando sistema de demostración...
              </div>
              <div className="text-green-400">
                [SUCCESS] Componentes UI cargados correctamente
              </div>
              <div className="text-yellow-400">
                [WARNING] Modo demostración activo
              </div>
              <div className="flex">
                <span className="text-[#00ff41] mr-2">$</span>
                <span>show --components</span>
              </div>
              <div className="text-gray-400 ml-4">
                ├── Badge Components ✓<br/>
                ├── Hacker Buttons ✓<br/>
                ├── Glow Cards ✓<br/>
                ├── Holographic Cards ✓<br/>
                ├── Matrix Rain ✓<br/>
                ├── Glitch Text ✓<br/>
                └── Cyber Grid ✓
              </div>
            </div>
          </TerminalWindow>
        </motion.section>

        {/* Glitch Text Examples */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <h2 className="text-2xl font-bold mb-6 terminal-text">Glitch Text Effects</h2>
          
          <div className="space-y-4">
            <div>
              <GlitchText 
                trigger="hover" 
                intensity="low"
                className="text-2xl"
              >
                Hover para efecto glitch suave
              </GlitchText>
            </div>
            <div>
              <GlitchText 
                trigger="click" 
                intensity="high"
                className="text-2xl"
              >
                Click para efecto glitch intenso
              </GlitchText>
            </div>
            <div>
              <GlitchText 
                trigger="auto" 
                intensity="medium"
                className="text-2xl"
              >
                Efecto automático aleatorio
              </GlitchText>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer 
          className="text-center py-8 border-t border-[#00ff41]/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <GlitchText 
            trigger="hover"
            className="text-lg"
          >
            TASAVE - Sistema de Componentes UI Cyberpunk
          </GlitchText>
          <p className="text-gray-500 mt-2">
            Inspirado en Skiper UI y MVP Blocks
          </p>
        </motion.footer>
      </div>
    </div>
  )
}