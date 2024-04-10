import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import PATH from '@/constants/paths'

const useScrollDetection = () => {
	const [scrolling, setScrolling] = useState(false)

	useEffect(() => {
		let scrollTimeout = null

		const startScroll = () => {
			if (!scrolling) setScrolling(true)
			if (scrollTimeout) clearTimeout(scrollTimeout)
			scrollTimeout = setTimeout(() => {
				setScrolling(false)
			}, 100) // 如果 100 毫秒內沒有進一步的滾動，則認為滾動已經停止
		}

		window.addEventListener('scroll', startScroll)

		return () => {
			window.removeEventListener('scroll', startScroll)
			if (scrollTimeout) clearTimeout(scrollTimeout)
		}
	}, [scrolling])

	return scrolling
}

const NavigationBar = () => {
	const router = useRouter()
	const isScrolling = useScrollDetection()
	const [lastScrollY, setLastScrollY] = useState(0)
	const [hidden, setHidden] = useState(false)

	const isActive = (path) => router.pathname === path

	const navClass = clsx(
		'sticky px-4 py-2 z-50 bg-amber-600 transition-[top] ease-in-out',
		{
			'top-0': !hidden,
			'-top-12': hidden,
		},
	)

	const linkClass = (path) =>
		clsx('text-white font-bold', {
			'text-amber-900': isActive(path),
		})

	useEffect(() => {
		if (!isScrolling) {
			setHidden(false)
		}
	}, [isScrolling])

	useEffect(() => {
		if (isScrolling && window.scrollY < lastScrollY) {
			setHidden(true)
		}
		setLastScrollY(window.scrollY)
	}, [isScrolling, lastScrollY])

	return (
		<nav className={navClass}>
			<ul className='flex gap-4'>
				<li>
					<Link href={PATH.HOME}>
						<div className={linkClass(PATH.HOME)}>
							Jedi Software
						</div>
					</Link>
				</li>
				<li>
					<Link href={PATH.MAZE}>
						<div className={linkClass(PATH.MAZE)}>Maze</div>
					</Link>
				</li>
			</ul>
		</nav>
	)
}

export default NavigationBar
