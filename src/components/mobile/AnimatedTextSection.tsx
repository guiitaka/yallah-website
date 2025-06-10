'use client'

import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal"

export default function AnimatedTextSection() {
    return (
        <section id="discover-section" className="bg-white py-12 px-4">
            <div className="w-full text-2xl sm:text-3xl md:text-4xl flex flex-col items-start justify-center font-bold text-gray-800 tracking-wide uppercase">
                <VerticalCutReveal
                    splitBy="characters"
                    staggerDuration={0.025}
                    staggerFrom="first"
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 21,
                    }}
                    containerClassName="leading-tight"
                >
                    {`ENCONTRE O SEU LUGAR 📍,`}
                </VerticalCutReveal>
                <VerticalCutReveal
                    splitBy="characters"
                    staggerDuration={0.025}
                    staggerFrom="last"
                    reverse={true}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 21,
                        delay: 0.5,
                    }}
                    containerClassName="leading-tight"
                >
                    {`SEM ESTRESSE 😌 E SEM`}
                </VerticalCutReveal>
                <VerticalCutReveal
                    splitBy="characters"
                    staggerDuration={0.025}
                    staggerFrom="center"
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 21,
                        delay: 1.1,
                    }}
                    containerClassName="leading-tight text-[#8BADA4]"
                >
                    {`COMPLICAÇÃO 👍.`}
                </VerticalCutReveal>
            </div>
        </section>
    )
} 