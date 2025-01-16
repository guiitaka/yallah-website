'use client'

import React from 'react'
import { styled } from 'styled-components'

const SearchContainer = styled.div`
  display: grid;
  grid-template: "search" 44px / 300px;
  justify-content: center;
  align-content: center;
  justify-items: stretch;
  align-items: stretch;
  width: 100%;

  input {
    display: block;
    grid-area: search;
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 100%;
    background: none;
    padding: 0 30px 0 60px;
    border: none;
    border-radius: 100px;
    font: 20px/1 system-ui, sans-serif;
    outline: none;
    outline-offset: -8px;
    color: #666;

    &::placeholder {
      color: #999;
    }

    &:focus {
      outline: none;
    }

    &:focus-visible {
      outline: none;
    }
  }

  svg {
    grid-area: search;
    overflow: visible;
    color: #3E5A54;
    fill: none;
    stroke: currentColor;
  }

  .bar {
    width: 100%;
    height: 100%;
    ry: 22px;
    stroke-width: 2;
    stroke: transparent;
    animation: bar-in 900ms 3s both, stroke-in 300ms 3s forwards;
  }

  @keyframes stroke-in {
    from { stroke: transparent; }
    to { stroke: currentColor; }
  }

  @keyframes bar-in {
    0% { stroke-dasharray: 0 180 0 226 0 405 0 0 }
    100% { stroke-dasharray: 0 0 181 0 227 0 405 0 }
  }

  .magnifier {
    transform: translate(16px, 10px);
  }

  .magnifier .glass {
    cx: 12;
    cy: 12;
    r: 10;
    stroke-width: 2;
  }

  .magnifier .handle {
    x1: 19;
    y1: 19;
    x2: 26;
    y2: 26;
    stroke-width: 2;
  }

  .spark {
    fill: currentColor;
    stroke: none;
    r: 15;
  }

  .spark:nth-child(1) {
    animation: spark-radius 2.03s 1s both, spark-one-motion 2s 1s both;
  }

  .spark:nth-child(2) {
    animation: spark-radius 2.03s 1s both, spark-two-motion 2.03s 1s both;
  }

  .spark:nth-child(3) {
    animation: spark-radius 2.05s 1s both, spark-three-motion 2.03s 1s both;
  }

  .burst {
    stroke-width: 3;
  }

  .burst :nth-child(2n) { color: #95CEB3 }
  .burst :nth-child(3n) { color: #3E5A54 }
  .burst :nth-child(4n) { color: #95CEB3 }
  .burst :nth-child(5n) { color: #3E5A54 }

  .circle { r: 6; }
  .rect { width: 10px; height: 10px; }
  .triangle { d: path("M0,-6 L7,6 L-7,6 Z"); stroke-linejoin: round; }
  .plus { d: path("M0,-5 L0,5 M-5,0L 5,0"); stroke-linecap: round; }

  .burst:nth-child(4) { transform: translate(30px, 100%) rotate(150deg); }
  .burst:nth-child(5) { transform: translate(50%, 0%) rotate(-20deg); }
  .burst:nth-child(6) { transform: translate(100%, 50%) rotate(75deg); }

  @keyframes particle-fade {
    0%, 100% { opacity: 0 }
    5%, 80% { opacity: 1 }
  }

  .burst :nth-child(1) { animation: particle-fade 600ms 2.95s both, particle-one-move 600ms 2.95s both; }
  .burst :nth-child(2) { animation: particle-fade 600ms 2.95s both, particle-two-move 600ms 2.95s both; }
  .burst :nth-child(3) { animation: particle-fade 600ms 2.95s both, particle-three-move 600ms 2.95s both; }
  .burst :nth-child(4) { animation: particle-fade 600ms 2.95s both, particle-four-move 600ms 2.95s both; }
  .burst :nth-child(5) { animation: particle-fade 600ms 2.95s both, particle-five-move 600ms 2.95s both; }
  .burst :nth-child(6) { animation: particle-fade 600ms 2.95s both, particle-six-move 600ms 2.95s both; }

  @keyframes particle-one-move { 0% { transform: rotate(0deg) translate(-5%) scale(0.0001, 0.0001) } 100% { transform: rotate(-20deg) translateX(8%) scale(0.5, 0.5) } }
  @keyframes particle-two-move { 0% { transform: rotate(0deg) translate(-5%) scale(0.0001, 0.0001) } 100% { transform: rotate(0deg) translateX(8%) scale(0.5, 0.5) } }
  @keyframes particle-three-move { 0% { transform: rotate(0deg) translate(-5%) scale(0.0001, 0.0001) } 100% { transform: rotate(20deg) translateX(8%) scale(0.5, 0.5) } }
  @keyframes particle-four-move { 0% { transform: rotate(0deg) translate(-5%) scale(0.0001, 0.0001) } 100% { transform: rotate(-35deg) translateX(12%) } }
  @keyframes particle-five-move { 0% { transform: rotate(0deg) translate(-5%) scale(0.0001, 0.0001) } 100% { transform: rotate(0deg) translateX(12%) } }
  @keyframes particle-six-move { 0% { transform: rotate(0deg) translate(-5%) scale(0.0001, 0.0001) } 100% { transform: rotate(35deg) translateX(12%) } }

  @keyframes spark-radius {
    0% { r: 0; animation-timing-function: cubic-bezier(0, 0.3, 0, 1.57) }
    30% { r: 15; animation-timing-function: cubic-bezier(1, -0.39, 0.68, 1.04) }
    95% { r: 8 }
    99% { r: 10 }
    99.99% { r: 7 }
    100% { r: 0 }
  }

  @keyframes spark-one-motion {
    0% { transform: translate(-20%, 50%); animation-timing-function: cubic-bezier(0.63, 0.88, 0, 1.25) }
    20% { transform: rotate(-0deg) translate(0%, -50%); animation-timing-function: ease-in }
    80% { transform: rotate(-230deg) translateX(-20%) rotate(-100deg) translateX(15%); animation-timing-function: linear }
    100% { transform: rotate(-360deg) translate(30px, 100%); animation-timing-function: cubic-bezier(.64,.66,0,.51) }
  }

  @keyframes spark-two-motion {
    0% { transform: translate(120%, 50%) rotate(-70deg) translateY(0%); animation-timing-function: cubic-bezier(0.36, 0.18, 0.94, 0.55) }
    20% { transform: translate(90%, -80%) rotate(60deg) translateY(-80%); animation-timing-function: cubic-bezier(0.16, 0.77, 1, 0.4) }
    40% { transform: translate(110%, -50%) rotate(-30deg) translateY(-120%); animation-timing-function: linear }
    70% { transform: translate(100%, -50%) rotate(120deg) translateY(-100%); animation-timing-function: linear }
    80% { transform: translate(95%, 50%) rotate(80deg) translateY(-150%); animation-timing-function: cubic-bezier(.64,.66,0,.51) }
    100% { transform: translate(100%, 50%) rotate(120deg) translateY(0%) }
  }

  @keyframes spark-three-motion {
    0% { transform: translate(50%, 100%) rotate(-40deg) translateX(0%); animation-timing-function: cubic-bezier(0.62, 0.56, 1, 0.54) }
    30% { transform: translate(40%, 70%) rotate(20deg) translateX(20%); animation-timing-function: cubic-bezier(0, 0.21, 0.88, 0.46) }
    40% { transform: translate(65%, 20%) rotate(-50deg) translateX(15%); animation-timing-function: cubic-bezier(0, 0.24, 1, 0.62) }
    60% { transform: translate(60%, -40%) rotate(-50deg) translateX(20%); animation-timing-function: cubic-bezier(0, 0.24, 1, 0.62) }
    70% { transform: translate(70%, -0%) rotate(-180deg) translateX(20%); animation-timing-function: cubic-bezier(0.15, 0.48, 0.76, 0.26) }
    100% { transform: translate(70%, -0%) rotate(-360deg) translateX(0%) rotate(180deg) translateX(20%); }
  }
`

export default function AnimatedSearch() {
  return (
    <SearchContainer>
      <svg viewBox="0 0 300 44" xmlns="http://www.w3.org/2000/svg">
        <rect className="bar"/>
        
        <g className="magnifier">
          <circle className="glass"/>
          <line className="handle" x1="19" y1="19" x2="26" y2="26"/>
        </g>

        <g className="sparks">
          <circle className="spark"/>
          <circle className="spark"/>
          <circle className="spark"/>
        </g>

        <g className="burst pattern-one">
          <circle className="particle circle"/>
          <path className="particle triangle"/>
          <circle className="particle circle"/>
          <path className="particle plus"/>
          <rect className="particle rect"/>
          <path className="particle triangle"/>
        </g>
        <g className="burst pattern-two">
          <path className="particle plus"/>
          <circle className="particle circle"/>
          <path className="particle triangle"/>
          <rect className="particle rect"/>
          <circle className="particle circle"/>
          <path className="particle plus"/>
        </g>
        <g className="burst pattern-three">
          <circle className="particle circle"/>
          <rect className="particle rect"/>
          <path className="particle plus"/>
          <path className="particle triangle"/>
          <rect className="particle rect"/>
          <path className="particle plus"/>
        </g>
      </svg>
      <input 
        type="search" 
        name="q" 
        aria-label="Buscar imóveis"
        placeholder="Buscar imóveis..."
      />
    </SearchContainer>
  )
} 