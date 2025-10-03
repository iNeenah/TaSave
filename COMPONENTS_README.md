# TaSave - Componentes UI Modernos

## 🚀 Nuevos Componentes Agregados

Hemos integrado una colección de componentes UI modernos inspirados en **Skiper UI** y **MVP Blocks**, adaptados al tema cyberpunk/hacker de TaSave.

### 📦 Componentes Disponibles

#### 1. **Badge** - Etiquetas con estilo hacker
```tsx
import { Badge } from '@/components/ui'

<Badge variant="default">Sistema Activo</Badge>
<Badge variant="success">Conexión Segura</Badge>
<Badge variant="warning">Alerta</Badge>
<Badge variant="destructive">Error Crítico</Badge>
```

#### 2. **HackerButton** - Botones con efectos cyberpunk
```tsx
import { HackerButton } from '@/components/ui'

<HackerButton variant="matrix" glitchEffect>
  <Terminal className="w-4 h-4 mr-2" />
  Ejecutar Código
</HackerButton>
```

**Variantes disponibles:**
- `default` - Estilo principal con brillo verde
- `matrix` - Efecto lluvia de Matrix
- `destructive` - Estilo de alerta roja
- `outline` - Solo borde
- `ghost` - Transparente
- `secondary` - Estilo secundario

#### 3. **GlowCard** - Tarjetas con efectos de brillo
```tsx
import { GlowCard } from '@/components/ui'

<GlowCard intensity="medium" glowColor="#00ff41">
  <h3>Título de la tarjeta</h3>
  <p>Contenido con efectos de brillo personalizables</p>
</GlowCard>
```

#### 4. **HolographicCard** - Tarjetas con efectos holográficos 3D
```tsx
import { HolographicCard } from '@/components/ui'

<HolographicCard intensity={0.5}>
  <div>Contenido con efectos 3D interactivos</div>
</HolographicCard>
```

#### 5. **TerminalWindow** - Ventana de terminal realista
```tsx
import { TerminalWindow } from '@/components/ui'

<TerminalWindow title="root@tasave:~$" showControls>
  <div>Contenido del terminal con controles funcionales</div>
</TerminalWindow>
```

#### 6. **MatrixRain** - Efecto lluvia de Matrix
```tsx
import { MatrixRain } from '@/components/ui'

<MatrixRain intensity="medium" color="#00ff41" />
```

#### 7. **GlitchText** - Texto con efectos glitch
```tsx
import { GlitchText } from '@/components/ui'

<GlitchText trigger="hover" intensity="medium">
  Texto con efecto glitch
</GlitchText>
```

**Triggers disponibles:**
- `hover` - Se activa al pasar el mouse
- `click` - Se activa al hacer click
- `auto` - Se activa automáticamente de forma aleatoria

#### 8. **CyberGrid** - Grid con efectos cyberpunk
```tsx
import { CyberGrid } from '@/components/ui'

<CyberGrid columns={3} gap={6} animated>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</CyberGrid>
```

### 🎨 Características Principales

- **Tema Cyberpunk/Hacker**: Todos los componentes siguen la estética del proyecto
- **Animaciones Fluidas**: Usando Framer Motion para transiciones suaves
- **Efectos Interactivos**: Responden a hover, click y otros eventos
- **Personalizable**: Colores, intensidad y comportamientos configurables
- **Responsive**: Optimizados para todos los tamaños de pantalla
- **Accesible**: Siguiendo las mejores prácticas de accesibilidad

### 🛠️ Dependencias Agregadas

```json
{
  "framer-motion": "^10.x.x",
  "lucide-react": "^0.x.x",
  "clsx": "^2.x.x",
  "tailwind-merge": "^2.x.x",
  "class-variance-authority": "^0.x.x"
}
```

### 📱 Página de Demostración

Visita `/showcase` para ver todos los componentes en acción con ejemplos interactivos.

### 🎯 Uso en el Proyecto

Los componentes ya están integrados en:
- **Navegación**: Usando HackerButton y GlitchText
- **Página Principal**: Con MatrixRain, HolographicCard y CyberGrid
- **Sistema de Badges**: Para estados y notificaciones

### 🔧 Personalización

Todos los componentes aceptan props de personalización:

```tsx
// Ejemplo de personalización avanzada
<GlowCard 
  intensity="high" 
  glowColor="#ff6b6b" 
  className="custom-class"
>
  <HackerButton 
    variant="matrix" 
    glitchEffect 
    size="lg"
  >
    <Shield className="w-5 h-5 mr-2" />
    Botón Personalizado
  </HackerButton>
</GlowCard>
```

### 🚀 Próximos Pasos

1. **Integrar en más páginas**: Dashboard, formularios, etc.
2. **Agregar más variantes**: Nuevos estilos y efectos
3. **Optimizar rendimiento**: Lazy loading y memoización
4. **Agregar tests**: Unit tests para cada componente
5. **Documentación interactiva**: Storybook o similar

---

¡Los componentes están listos para usar y mejorar la experiencia visual de TaSave! 🎉