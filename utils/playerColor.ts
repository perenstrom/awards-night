export const getPlayerColor = (style: number) => {
  switch (style) {
    case 0:
      return { background: '#1395BA', text: 'white', glow: 'black' };
    case 1:
      return { background: '#A2B86C', text: 'black', glow: 'transparent' };
    case 2:
      return { background: '#EBC844', text: 'black', glow: 'transparent' };
    case 3:
      return { background: '#EF8B2C', text: 'black', glow: 'transparent' };
    case 4:
      return { background: '#C02E1D', text: 'white', glow: 'black' };
    case 5:
      return { background: '#0F5B78', text: 'white', glow: 'black' };
    case 6:
      return { background: '#D94E1F', text: 'white', glow: 'black' };
    case 7:
      return { background: '#5CA793', text: 'white', glow: 'black' };
    case 8:
      return { background: '#651199', text: 'white', glow: 'black' };
    case 9:
      return { background: '#CE4CA2', text: 'black', glow: 'white' };
    case 10:
      return { background: '#8E1063', text: 'white', glow: 'black' };
    case 11:
      return { background: '#4C8315', text: 'white', glow: 'black' };
    default:
      return { background: '#1395BA', text: 'white', glow: 'black' };
  }
};
