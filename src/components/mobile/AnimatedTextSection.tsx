'use client'

import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const textLines = [
    { text: `ENCONTRE O SEU LUGAR 📍,`, className: "text-gray-800" },
    { text: `SEM ESTRESSE 😊 E SEM`, className: "text-gray-800" },
    { text: `COMPLICAÇÃO 👍.`, className: "text-teal-500" },
];

const lineVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
        y: 0,
        opacity: 1,
        transition: {
            delay: i * 0.2,
            duration: 0.5,
            ease: "easeOut",
        },
    }),
};

export default function AnimatedTextSection() {
    const controls = useAnimation();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    controls.start("visible");
                }
            },
            {
                threshold: 0.1,
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [controls]);

    return (
        <section ref={ref} id="imoveis-disponiveis" className="bg-gray-50 py-12 px-4 text-left">
            <h2 className="text-4xl font-bold">
                {textLines.map((line, index) => (
                    <motion.div
                        key={index}
                        className={line.className}
                        custom={index}
                        initial="hidden"
                        animate={controls}
                        variants={lineVariants}
                        style={{ display: 'block' }} // Garante que cada linha seja um bloco
                    >
                        {line.text}
                    </motion.div>
                ))}
            </h2>
        </section>
    )
} 