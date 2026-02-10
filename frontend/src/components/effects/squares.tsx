interface SquaresProps {
  direction?: string
  speed?: number
  borderColor?: string
  hoverFillColor?: string
  squareSize?: number
}

export default function Squares(_props: SquaresProps) {
  return <div className="absolute inset-0" />
}
