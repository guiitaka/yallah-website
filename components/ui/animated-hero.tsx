import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@components/ui/button";
import Link from "next/link";

function Hero() {
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ["Aventura", "Descoberta", "Escapada", "Jornada", "Experiência"],
        []
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (titleNumber === titles.length - 1) {
                setTitleNumber(0);
            } else {
                setTitleNumber(titleNumber + 1);
            }
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    return (
        <div className="w-full">
            <div className="container mx-auto">
                <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
                    <div>
                        <Link href="https://www.yallah.com.br/owner#about-us" target="_blank" rel="noopener noreferrer">
                            <Button variant="secondary" size="lg" className="gap-4 px-8 py-3 text-base md:text-lg text-[#8BADA4]">
                                Conheça nossa história <MoveRight className="w-4 h-4 md:w-5 md:h-5" />
                            </Button>
                        </Link>
                    </div>
                    <div className="flex gap-4 flex-col">
                        <h1 className="text-6xl md:text-7xl lg:text-8xl max-w-4xl tracking-tighter text-center font-bold">
                            <span className="text-spektr-cyan-50">Sua Próxima</span>
                            <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1 text-6xl md:text-7xl lg:text-8xl" style={{ height: 'calc(1em * 1.2)' }}>
                                &nbsp;
                                {titles.map((title, index) => (
                                    <motion.span
                                        key={index}
                                        className="absolute font-semibold text-[#8BADA4] text-6xl md:text-7xl lg:text-8xl"
                                        initial={{ opacity: 0, y: "-100" }}
                                        transition={{ type: "spring", stiffness: 50 }}
                                        animate={
                                            titleNumber === index
                                                ? {
                                                    y: 0,
                                                    opacity: 1,
                                                }
                                                : {
                                                    y: titleNumber > index ? -200 : 200,
                                                    opacity: 0,
                                                }
                                        }
                                    >
                                        {title}
                                    </motion.span>
                                ))}
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl leading-relaxed md:leading-loose tracking-tight text-muted-foreground max-w-3xl text-center">
                            Na Yallah, transformamos suas viagens em experiências inesquecíveis.
                            Encontre acomodações únicas e viva momentos autênticos, cuidadosamente
                            selecionados para você. Prepare-se para explorar o mundo de uma forma totalmente nova.
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                        <Link href="tel:+5511999999999">
                            <Button size="lg" className="gap-4 px-8 sm:px-10 py-4 text-lg md:text-xl border-[#8BADA4] text-[#8BADA4] hover:bg-[#8BADA4]/10 hover:text-[#8BADA4]" variant="outline">
                                Fale Conosco <PhoneCall className="w-5 h-5 md:w-6 md:h-6" />
                            </Button>
                        </Link>
                        <Link href="#discover-section">
                            <Button size="lg" className="gap-4 px-8 sm:px-10 py-4 text-lg md:text-xl bg-[#8BADA4] hover:bg-[#7A9A8D] text-white">
                                Explorar Agora <MoveRight className="w-5 h-5 md:w-6 md:h-6" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Hero }; 