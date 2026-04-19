export type Move = 'rock' | 'paper' | 'scissors';

export const MOVES: { id: Move; label: string; icon: string; beats: Move }[] = [
  { id: 'rock', label: 'Rock', icon: '🪨', beats: 'scissors' },
  { id: 'paper', label: 'Paper', icon: '📄', beats: 'rock' },
  { id: 'scissors', label: 'Scissors', icon: '✂️', beats: 'paper' },
];

export const WIN_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3';
export const LOSE_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3';

// Base Builder Code (example, should be replaced with actual code if needed)
// Usually it's a specific hex string to be included in the 'data' or 'to' address
export const BUILDER_CODE_HEX = '0x12345678'; 
export const CHECK_IN_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Mock or actual check-in contract
