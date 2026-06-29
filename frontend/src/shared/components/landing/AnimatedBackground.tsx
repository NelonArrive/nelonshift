'use client'

import { useCallback, useEffect, useRef } from 'react'

interface Particle {
	x: number
	y: number
	size: number
	baseSize: number
	speedX: number
	speedY: number
	opacity: number
	pulse: number
	hue: number
}

interface FloatingShape {
	x: number
	y: number
	size: number
	rotation: number
	rotationSpeed: number
	opacity: number
	speedX: number
	speedY: number
}

export function AnimatedBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const mouseRef = useRef({ x: -1000, y: -1000 })
	const cursorGlowRef = useRef({ x: 0, y: 0, intensity: 0 })

	const animate = useCallback(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		let animationId: number
		let particles: Particle[] = []
		let shapes: FloatingShape[] = []

		const resize = () => {
			canvas.width = window.innerWidth
			canvas.height = window.innerHeight
		}

		const createParticles = () => {
			const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 20000))
			particles = Array.from({ length: count }, () => ({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				size: Math.random() * 2 + 0.5,
				baseSize: Math.random() * 2 + 0.5,
				speedX: (Math.random() - 0.5) * 0.3,
				speedY: (Math.random() - 0.5) * 0.3,
				opacity: Math.random() * 0.4 + 0.1,
				pulse: Math.random() * Math.PI * 2,
				hue: 230 + Math.random() * 60
			}))
		}

		const createShapes = () => {
			shapes = Array.from({ length: 6 }, (_, i) => ({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				size: 30 + Math.random() * 50,
				rotation: Math.random() * Math.PI * 2,
				rotationSpeed: (Math.random() - 0.5) * 0.003,
				opacity: 0.03 + Math.random() * 0.03,
				speedX: (Math.random() - 0.5) * 0.15,
				speedY: (Math.random() - 0.5) * 0.15
			}))
		}

		const drawMeshGradient = (time: number) => {
			const cx1 = canvas.width * 0.3 + Math.sin(time * 0.0003) * 150
			const cy1 = canvas.height * 0.3 + Math.cos(time * 0.0002) * 100
			const cx2 = canvas.width * 0.7 + Math.cos(time * 0.00025) * 150
			const cy2 = canvas.height * 0.7 + Math.sin(time * 0.00035) * 120

			const g1 = ctx.createRadialGradient(cx1, cy1, 0, cx1, cy1, canvas.width * 0.5)
			g1.addColorStop(0, 'rgba(99, 102, 241, 0.12)')
			g1.addColorStop(0.5, 'rgba(139, 92, 246, 0.06)')
			g1.addColorStop(1, 'rgba(0, 0, 0, 0)')
			ctx.fillStyle = g1
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, canvas.width * 0.4)
			g2.addColorStop(0, 'rgba(59, 130, 246, 0.08)')
			g2.addColorStop(0.5, 'rgba(168, 85, 247, 0.04)')
			g2.addColorStop(1, 'rgba(0, 0, 0, 0)')
			ctx.fillStyle = g2
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			const g3 = ctx.createRadialGradient(
				canvas.width * 0.5 + Math.sin(time * 0.0002) * 200,
				canvas.height * 0.5,
				0,
				canvas.width * 0.5,
				canvas.height * 0.5,
				canvas.width * 0.6
			)
			g3.addColorStop(0, 'rgba(236, 72, 153, 0.05)')
			g3.addColorStop(0.5, 'rgba(244, 63, 94, 0.02)')
			g3.addColorStop(1, 'rgba(0, 0, 0, 0)')
			ctx.fillStyle = g3
			ctx.fillRect(0, 0, canvas.width, canvas.height)
		}

		const drawParticle = (p: Particle, time: number) => {
			const pulse = Math.sin(p.pulse + time * 0.002) * 0.4 + 0.6
			const size = p.size * pulse

			const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 4)
			grad.addColorStop(0, `hsla(${p.hue}, 80%, 65%, ${p.opacity * pulse})`)
			grad.addColorStop(0.4, `hsla(${p.hue}, 70%, 55%, ${p.opacity * pulse * 0.4})`)
			grad.addColorStop(1, `hsla(${p.hue}, 60%, 50%, 0)`)
			ctx.fillStyle = grad
			ctx.beginPath()
			ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2)
			ctx.fill()

			ctx.beginPath()
			ctx.arc(p.x, p.y, size * 0.8, 0, Math.PI * 2)
			ctx.fillStyle = `hsla(${p.hue}, 90%, 80%, ${p.opacity * pulse * 1.5})`
			ctx.fill()
		}

		const drawConnections = () => {
			const maxDist = 100
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x
					const dy = particles[i].y - particles[j].y
					const dist = Math.sqrt(dx * dx + dy * dy)
					if (dist < maxDist) {
						const alpha = (1 - dist / maxDist) * 0.12
						ctx.beginPath()
						ctx.moveTo(particles[i].x, particles[i].y)
						ctx.lineTo(particles[j].x, particles[j].y)
						ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`
						ctx.lineWidth = 0.5
						ctx.stroke()
					}
				}
			}
		}

		const drawShapes = (time: number) => {
			shapes.forEach(s => {
				s.x += s.speedX + Math.sin(time * 0.0005 + s.y * 0.01) * 0.1
				s.y += s.speedY + Math.cos(time * 0.0004 + s.x * 0.01) * 0.1
				s.rotation += s.rotationSpeed

				if (s.x < -100) s.x = canvas.width + 100
				if (s.x > canvas.width + 100) s.x = -100
				if (s.y < -100) s.y = canvas.height + 100
				if (s.y > canvas.height + 100) s.y = -100

				ctx.save()
				ctx.translate(s.x, s.y)
				ctx.rotate(s.rotation)
				ctx.globalAlpha = s.opacity
				ctx.strokeStyle = 'rgba(139, 92, 246, 0.8)'
				ctx.lineWidth = 1
				ctx.strokeRect(-s.size / 2, -s.size / 2, s.size, s.size)
				ctx.restore()
			})
		}

		const drawCursorGlow = (time: number) => {
			const glow = cursorGlowRef.current
			const mouse = mouseRef.current

			glow.x += (mouse.x - glow.x) * 0.08
			glow.y += (mouse.y - glow.y) * 0.08
			glow.intensity += (0.15 - glow.intensity) * 0.05

			if (mouse.x > 0 && mouse.y > 0) {
				const pulse = Math.sin(time * 0.003) * 0.03 + 0.12
				const grad = ctx.createRadialGradient(
					glow.x, glow.y, 0,
					glow.x, glow.y, 250
				)
				grad.addColorStop(0, `rgba(139, 92, 246, ${pulse + glow.intensity})`)
				grad.addColorStop(0.3, `rgba(99, 102, 241, ${(pulse + glow.intensity) * 0.5})`)
				grad.addColorStop(0.6, `rgba(168, 85, 247, ${(pulse + glow.intensity) * 0.2})`)
				grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
				ctx.fillStyle = grad
				ctx.fillRect(0, 0, canvas.width, canvas.height)

				const innerGrad = ctx.createRadialGradient(
					glow.x, glow.y, 0,
					glow.x, glow.y, 40
				)
				innerGrad.addColorStop(0, `rgba(255, 255, 255, ${0.03 + glow.intensity * 0.1})`)
				innerGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
				ctx.fillStyle = innerGrad
				ctx.beginPath()
				ctx.arc(glow.x, glow.y, 40, 0, Math.PI * 2)
				ctx.fill()
			}
		}

		const frame = (time: number) => {
			ctx.clearRect(0, 0, canvas.width, canvas.height)

			drawMeshGradient(time)
			drawShapes(time)
			drawConnections()

			const mouse = mouseRef.current
			particles.forEach(p => {
				const dx = mouse.x - p.x
				const dy = mouse.y - p.y
				const dist = Math.sqrt(dx * dx + dy * dy)
				if (dist < 180 && dist > 0) {
					const force = (180 - dist) / 180
					p.speedX -= (dx / dist) * force * 0.03
					p.speedY -= (dy / dist) * force * 0.03
					p.size = p.baseSize + force * 2
				} else {
					p.size += (p.baseSize - p.size) * 0.05
				}

				p.x += p.speedX
				p.y += p.speedY
				p.pulse += 0.015
				p.speedX *= 0.995
				p.speedY *= 0.995

				if (p.x < -20) p.x = canvas.width + 20
				if (p.x > canvas.width + 20) p.x = -20
				if (p.y < -20) p.y = canvas.height + 20
				if (p.y > canvas.height + 20) p.y = -20

				drawParticle(p, time)
			})

			drawCursorGlow(time)

			animationId = requestAnimationFrame(frame)
		}

		const handleMouseMove = (e: MouseEvent) => {
			mouseRef.current = { x: e.clientX, y: e.clientY }
		}

		const handleMouseLeave = () => {
			mouseRef.current = { x: -1000, y: -1000 }
		}

		resize()
		createParticles()
		createShapes()
		animationId = requestAnimationFrame(frame)

		window.addEventListener('resize', () => {
			resize()
			createParticles()
			createShapes()
		})
		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseleave', handleMouseLeave)

		return () => {
			cancelAnimationFrame(animationId)
			window.removeEventListener('resize', resize)
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseleave', handleMouseLeave)
		}
	}, [])

	useEffect(() => {
		const cleanup = animate()
		return cleanup
	}, [animate])

	return (
		<div className='pointer-events-none fixed inset-0 z-0'>
			<canvas ref={canvasRef} className='h-full w-full' />
			<div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60' />
		</div>
	)
}
