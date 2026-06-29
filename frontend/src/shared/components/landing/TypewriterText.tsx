'use client'

import { useCallback, useEffect, useState } from 'react'

interface TypewriterTextProps {
	phrases: string[]
	typingSpeed?: number
	deletingSpeed?: number
	pauseDuration?: number
	className?: string
}

export function TypewriterText({
	phrases,
	typingSpeed = 80,
	deletingSpeed = 40,
	pauseDuration = 2000,
	className = ''
}: TypewriterTextProps) {
	const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
	const [currentText, setCurrentText] = useState('')
	const [isDeleting, setIsDeleting] = useState(false)
	const [isPaused, setIsPaused] = useState(false)

	const animate = useCallback(() => {
		const currentPhrase = phrases[currentPhraseIndex]

		if (isPaused) return

		if (!isDeleting) {
			if (currentText.length < currentPhrase.length) {
				setTimeout(() => {
					setCurrentText(currentPhrase.slice(0, currentText.length + 1))
				}, typingSpeed)
			} else {
				setIsPaused(true)
				setTimeout(() => {
					setIsPaused(false)
					setIsDeleting(true)
				}, pauseDuration)
			}
		} else {
			if (currentText.length > 0) {
				setTimeout(() => {
					setCurrentText(currentText.slice(0, -1))
				}, deletingSpeed)
			} else {
				setIsDeleting(false)
				setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
			}
		}
	}, [
		currentText,
		currentPhraseIndex,
		isDeleting,
		isPaused,
		phrases,
		typingSpeed,
		deletingSpeed,
		pauseDuration
	])

	useEffect(() => {
		const timeout = setTimeout(animate, 50)
		return () => clearTimeout(timeout)
	}, [animate])

	return (
		<span className={className}>
			{currentText}
			<span className='ml-0.5 inline-block h-[1em] w-[3px] animate-pulse bg-current' />
		</span>
	)
}
