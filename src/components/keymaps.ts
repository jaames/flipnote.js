export type SliderKeyAction = 
  | 'decrease' 
  | 'increase'
;

export type PlayerKeyAction = 
  | 'prev' 
  | 'next'
  | 'playpause'
;

export const KEY_MAP_SLIDER: Record<KeyboardEvent['key'], SliderKeyAction> = {
  'a': 'decrease',
  's': 'decrease',
  'd': 'increase',
  'w': 'increase',
  'ArrowLeft': 'decrease',
  'ArrowDown': 'decrease',
  'ArrowRight': 'increase',
  'ArrowUp': 'increase',
};

export const KEY_MAP_PLAYER: Record<KeyboardEvent['key'], PlayerKeyAction> = {
  ' ': 'playpause',
  'Enter': 'playpause',
  'a': 'prev',
  's': 'prev',
  'd': 'next',
  'w': 'next',
  'ArrowLeft': 'prev',
  'ArrowDown': 'prev',
  'ArrowRight': 'next',
  'ArrowUp': 'next',
};