'use client';

import React, { useRef } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, PanInfo } from 'framer-motion';

interface ReviewItem {
    type: string;
    imageUri: string;
    heading: string;
    description: string;
    key: string;
    color: string;
}

const data: ReviewItem[] = [
    {
        type: 'Cliente há 3 anos',
        imageUri: '/reviews/pessoa-0.png',
        heading: 'Maria Silva',
        description: '"A Yallah transformou a gestão do meu apartamento. Profissionalismo e tranquilidade que eu precisava."',
        key: 'first',
        color: 'transparent'
    },
    {
        type: 'Cliente há 1 ano',
        imageUri: '/reviews/pessoa-1.png',
        heading: 'João Santos',
        description: '"Desde que confiei meu imóvel à Yallah, não me preocupo mais com nada. Ótimo serviço!"',
        key: 'second',
        color: 'transparent'
    },
    {
        type: 'Cliente há 2 anos',
        imageUri: '/reviews/pessoa-4.png',
        heading: 'Ana Costa',
        description: '"Excelente gestão do meu apartamento. A equipe é muito atenciosa e profissional."',
        key: 'third',
        color: 'transparent'
    },
    {
        type: 'Cliente há 4 anos',
        imageUri: '/reviews/pessoa-5.png',
        heading: 'Pedro Oliveira',
        description: '"Melhor decisão que tomei foi confiar meu imóvel à Yallah. Serviço impecável!"',
        key: 'fourth',
        color: 'transparent'
    },
    {
        type: 'Cliente há 2 anos',
        imageUri: '/reviews/pessoa-6.png',
        heading: 'Carla Mendes',
        description: '"Profissionalismo e dedicação em cada detalhe. Recomendo fortemente!"',
        key: 'fifth',
        color: 'transparent'
    },
    {
        type: 'Cliente há 3 anos',
        imageUri: '/reviews/pessoa-7.png',
        heading: 'Roberto Lima',
        description: '"A Yallah superou todas as minhas expectativas. Gestão de alto nível!"',
        key: 'sixth',
        color: 'transparent'
    },
    {
        type: 'Cliente há 1 ano',
        imageUri: '/reviews/pessoa-8.png',
        heading: 'Luciana Ferreira',
        description: '"Serviço excepcional! Meu apartamento está em ótimas mãos."',
        key: 'seventh',
        color: 'transparent'
    },
    {
        type: 'Cliente há 2 anos',
        imageUri: '/reviews/pessoa-9.png',
        heading: 'Ricardo Santos',
        description: '"A tranquilidade que eu precisava na gestão do meu imóvel. Equipe nota 10!"',
        key: 'eighth',
        color: 'transparent'
    }
];

const WINDOW_WIDTH = typeof window !== 'undefined' ? window.innerWidth : 1200;
const CIRCLE_SIZE = WINDOW_WIDTH * 0.6;
const DOT_SIZE = 40;

interface ItemProps {
    imageUri: string;
    heading: string;
    description: string;
    isActive: boolean;
    direction: 'left' | 'right';
}

const Item: React.FC<ItemProps> = ({ imageUri, heading, description, isActive, direction }) => {
    return (
        <motion.div
            className="w-full h-full flex flex-col items-center justify-center bg-transparent pt-20 pb-28"
            initial={{ opacity: 0, x: direction === 'right' ? 100 : -100 }}
            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : (direction === 'right' ? -100 : 100) }}
            exit={{ opacity: 0, x: direction === 'right' ? -100 : 100 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="relative w-56 h-56 mb-6"
                initial={{ scale: 0.2 }}
                animate={{ scale: isActive ? 1 : 0.2 }}
                transition={{ duration: 0.5 }}
            >
                <img
                    src={imageUri}
                    alt={heading}
                    className="w-full h-full object-cover rounded-full"
                />
            </motion.div>
            <motion.div
                className="text-center max-w-2xl mx-auto px-4 mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h2 className="text-2xl font-bold text-white mb-3">{heading}</h2>
                <p className="text-lg text-white/90 italic leading-relaxed max-w-xl mx-auto">{description}</p>
            </motion.div>
        </motion.div>
    );
};

interface CircleProps {
    activeIndex: number;
}

const Circle: React.FC<CircleProps> = ({ activeIndex }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {data.map((item, index) => (
                <motion.div
                    key={item.key}
                    className="absolute rounded-full"
                    style={{
                        width: CIRCLE_SIZE,
                        height: CIRCLE_SIZE,
                        backgroundColor: item.color,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: activeIndex === index ? 1 : 0,
                        opacity: activeIndex === index ? 0.05 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                />
            ))}
        </div>
    );
};

interface PaginationProps {
    activeIndex: number;
    setActiveIndex: (index: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ activeIndex, setActiveIndex }) => {
    return (
        <div className="absolute bottom-8 right-10 flex items-center space-x-2 z-10">
            {data.map((item, index) => (
                <motion.button
                    key={item.key}
                    className="w-2 h-2 rounded-full bg-white/30"
                    onClick={() => setActiveIndex(index)}
                    whileHover={{ scale: 1.2 }}
                    animate={{
                        scale: activeIndex === index ? 1.2 : 1,
                        backgroundColor: activeIndex === index ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                    }}
                />
            ))}
        </div>
    );
};

interface TickerProps {
    activeIndex: number;
}

const Ticker: React.FC<TickerProps> = ({ activeIndex }) => {
    return (
        <div className="absolute top-24 left-10 h-8 overflow-hidden z-10">
            <motion.div
                animate={{ y: -activeIndex * 32 }}
                transition={{ duration: 0.5 }}
            >
                {data.map((item) => (
                    <div
                        key={item.key}
                        className="h-8 flex items-center text-base font-medium text-white/90"
                    >
                        {item.type}
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default function ReviewsCarousel() {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [direction, setDirection] = React.useState<'left' | 'right'>('right');
    const controls = useAnimation();
    const dragX = useMotionValue(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setDirection('right');
            setActiveIndex((prev) => (prev + 1) % data.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 50;
        if (Math.abs(info.offset.x) > threshold) {
            if (info.offset.x > 0) {
                setDirection('left');
                setActiveIndex((prev) => (prev - 1 + data.length) % data.length);
            } else {
                setDirection('right');
                setActiveIndex((prev) => (prev + 1) % data.length);
            }
        }
    };

    return (
        <div className="relative w-full h-full overflow-hidden bg-transparent">
            <Circle activeIndex={activeIndex} />

            <motion.div
                className="w-full h-full"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                style={{ x: dragX }}
            >
                <AnimatePresence mode="wait">
                    <Item
                        key={data[activeIndex].key}
                        {...data[activeIndex]}
                        isActive={true}
                        direction={direction}
                    />
                </AnimatePresence>
            </motion.div>

            <Pagination activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
            <Ticker activeIndex={activeIndex} />
        </div>
    );
} 