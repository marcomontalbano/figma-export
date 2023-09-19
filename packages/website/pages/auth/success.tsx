import Link from 'next/link'
import GitHubLink from '../../src/GitHubLink'
import { useEffect, useRef, useState } from 'react'

export default function HomePage() {
    const [pin, setPin] = useState<number>(NaN)
    const [timer, setTimer] = useState<number>(30)
    const interval = useRef<NodeJS.Timer>()

    useEffect(function handleTimer() {
        if (interval.current == null && !isNaN(pin)) {
            const endTimeString = window.sessionStorage.getItem(pin.toString())
            if (endTimeString == null) {
                window.sessionStorage.setItem(pin.toString(), (Date.now() + 30 * 1000).toString())
            } else {
                const endTime = parseInt(endTimeString ?? '0')
                setTimer(Math.round((endTime - Date.now()) / 1000))
            }

            interval.current = setInterval(() => setTimer((t) => t - 1), 1000);
        }

        () => clearInterval(interval.current)
    }, [pin])

    useEffect(function clearTimer() {
        if (timer < 0) {
            clearInterval(interval.current)
            setTimer(0)
        }
    }, [timer])


    useEffect(function readPin() {
        setPin(parseInt(window.location.hash.slice(1)))
    }, [])

    if (isNaN(pin)) {
        return (
            <>
                <div className="container hero figma-gradient with-opacity-05">
                    <section>
                        <h1 className="title">
                            <Link href="/"><a className="figma-gradient text">
                                @figma-export
                            </a></Link>
                        </h1>
                    </section>
                </div>
                <GitHubLink />
            </>
        )
    }

    return (
        <>
            <div className="container hero figma-gradient with-opacity-05">
                <section>
                    <h1 className="title">
                        <Link href="/"><a className="figma-gradient text">
                            @figma-export
                        </a></Link>
                    </h1>
                    <p>
                        <code className="figma-gradient with-opacity-10" style={{ fontSize: '36px', textDecoration: timer > 0 ? undefined : 'line-through' }}>{pin}</code>
                    </p>
                    {
                        timer > 0 ? (
                            <p>Copy this <code>pin</code> in your terminal window in {timer} seconds.</p>
                        ) : (
                            <p>This <code>pin</code> expired.</p>
                        )
                    }
                </section>
            </div>
            <GitHubLink />
        </>
    )
}
