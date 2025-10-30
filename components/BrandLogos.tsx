interface BrandLogoProps {
  brand: string;
  className?: string;
}

export function BrandLogo({ brand, className = 'w-12 h-12' }: BrandLogoProps) {
  const logos: Record<string, JSX.Element> = {
    audi: (
      <svg
        viewBox='0 0 120 120'
        className={className}
        fill='currentColor'
        xmlns='http://www.w3.org/2000/svg'
      >
        <g fill='#BB0A30'>
          <circle cx='28' cy='60' r='20' fill='none' stroke='#BB0A30' strokeWidth='4' />
          <circle cx='52' cy='60' r='20' fill='none' stroke='#BB0A30' strokeWidth='4' />
          <circle cx='76' cy='60' r='20' fill='none' stroke='#BB0A30' strokeWidth='4' />
          <circle cx='100' cy='60' r='20' fill='none' stroke='#BB0A30' strokeWidth='4' />
        </g>
      </svg>
    ),
    bmw: (
      <svg
        viewBox='0 0 120 120'
        className={className}
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle cx='60' cy='60' r='50' fill='#0066B1' />
        <circle cx='60' cy='60' r='42' fill='white' stroke='#0066B1' strokeWidth='8' />
        <path
          d='M 60 18 L 60 60 L 18 60 A 42 42 0 0 1 60 18'
          fill='#0066B1'
        />
        <path
          d='M 60 102 L 60 60 L 102 60 A 42 42 0 0 1 60 102'
          fill='#0066B1'
        />
      </svg>
    ),
    mercedes: (
      <svg
        viewBox='0 0 120 120'
        className={className}
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle cx='60' cy='60' r='50' fill='none' stroke='#00ADEF' strokeWidth='4' />
        <path
          d='M 60 15 L 60 60 M 60 60 L 25 85 M 60 60 L 95 85'
          stroke='#00ADEF'
          strokeWidth='4'
          fill='none'
        />
      </svg>
    ),
    porsche: (
      <svg
        viewBox='0 0 120 120'
        className={className}
        xmlns='http://www.w3.org/2000/svg'
      >
        <rect x='20' y='30' width='80' height='60' rx='5' fill='#D5001C' />
        <rect x='30' y='40' width='60' height='40' rx='3' fill='#FFD700' />
        <text
          x='60'
          y='67'
          textAnchor='middle'
          fill='#D5001C'
          fontSize='18'
          fontWeight='bold'
          fontFamily='Arial'
        >
          P
        </text>
      </svg>
    ),
    volkswagen: (
      <svg
        viewBox='0 0 120 120'
        className={className}
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle cx='60' cy='60' r='50' fill='#001E50' />
        <circle cx='60' cy='60' r='42' fill='white' />
        <path
          d='M 35 45 L 48 75 L 60 55 L 72 75 L 85 45 M 40 60 L 80 60'
          stroke='#001E50'
          strokeWidth='5'
          fill='none'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    ),
    mini: (
      <svg
        viewBox='0 0 120 120'
        className={className}
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle cx='60' cy='60' r='50' fill='black' />
        <circle cx='60' cy='60' r='40' fill='white' />
        <text
          x='60'
          y='72'
          textAnchor='middle'
          fill='black'
          fontSize='24'
          fontWeight='bold'
          fontFamily='Arial, sans-serif'
        >
          MINI
        </text>
      </svg>
    ),
  };

  return logos[brand.toLowerCase()] || (
    <div className={`${className} bg-gray-200 rounded-full flex items-center justify-center`}>
      <span className='text-gray-500 text-2xl font-bold'>
        {brand.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
