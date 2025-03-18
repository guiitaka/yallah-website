import React from 'react';

interface SaoPauloMapProps {
    className?: string;
    fill?: string;
    stroke?: string;
}

const SaoPauloMap: React.FC<SaoPauloMapProps> = ({
    className = '',
    fill = 'currentColor',
    stroke = 'currentColor'
}) => {
    return (
        <svg
            className={className}
            viewBox="0 0 400 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Contorno principal de São Paulo */}
            <path
                d="M50 150c0-20 5-40 15-60s25-35 45-45c20-10 40-15 60-15h60c20 0 40 5 60 15s35 25 45 45c10 20 15 40 15 60v300c0 20-5 40-15 60s-25 35-45 45c-20 10-40 15-60 15h-60c-20 0-40-5-60-15s-35-25-45-45c-10-20-15-40-15-60V150z"
                fill={fill}
                stroke={stroke}
                strokeWidth="1"
            />

            {/* Divisões dos distritos */}
            <path
                d="M100 180c10-30 30-50 60-60M160 120c30-10 60-10 90 0M250 120c30 10 50 30 60 60M310 180c10 30 10 60 0 90M310 270c-10 30-30 50-60 60M250 330c-30 10-60 10-90 0M160 330c-30-10-50-30-60-60M100 270c-10-30-10-60 0-90"
                stroke={stroke}
                strokeWidth="1"
                fill="none"
            />

            {/* Divisões internas dos distritos */}
            <path
                d="M130 150c20-20 40-30 70-30M200 120c30 0 50 10 70 30M270 150c20 20 30 40 30 70M300 220c0 30-10 50-30 70M270 290c-20 20-40 30-70 30M200 320c-30 0-50-10-70-30M130 290c-20-20-30-40-30-70M100 220c0-30 10-50 30-70"
                stroke={stroke}
                strokeWidth="0.5"
                strokeDasharray="4 4"
                fill="none"
            />

            {/* Linhas de conexão entre distritos */}
            <path
                d="M200 120v200M100 220h200M130 150l140 140M270 150l-140 140"
                stroke={stroke}
                strokeWidth="0.5"
                strokeDasharray="4 4"
                fill="none"
            />

            {/* Círculos nos pontos de interseção principais */}
            <g>
                <circle cx="200" cy="220" r="3" fill={stroke} />
                <circle cx="130" cy="150" r="2" fill={stroke} />
                <circle cx="270" cy="150" r="2" fill={stroke} />
                <circle cx="130" cy="290" r="2" fill={stroke} />
                <circle cx="270" cy="290" r="2" fill={stroke} />
            </g>

            {/* Círculos nos pontos de interseção secundários */}
            <g>
                <circle cx="200" cy="120" r="1.5" fill={stroke} />
                <circle cx="200" cy="320" r="1.5" fill={stroke} />
                <circle cx="100" cy="220" r="1.5" fill={stroke} />
                <circle cx="300" cy="220" r="1.5" fill={stroke} />
            </g>
        </svg>
    );
};

export default SaoPauloMap; 