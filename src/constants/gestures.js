export const MIN_GESTURE_CONFIDENCE = 0.62;
export const ACTION_COOLDOWN_MS = 1450;

export const GESTURE_ACTIONS = {
  Thumb_Up: {
    label: 'گزینه A',
    type: 'ANSWER',
    optionKey: 'A',
    emoji: '👍',
    color: 'from-emerald-500 to-teal-500',
  },
  Victory: {
    label: 'گزینه B',
    type: 'ANSWER',
    optionKey: 'B',
    emoji: '✌️',
    color: 'from-sky-500 to-cyan-500',
  },
  Open_Palm: {
    label: 'گزینه C',
    type: 'ANSWER',
    optionKey: 'C',
    emoji: '✋',
    color: 'from-violet-500 to-fuchsia-500',
  },
  Closed_Fist: {
    label: 'گزینه D',
    type: 'ANSWER',
    optionKey: 'D',
    emoji: '✊',
    color: 'from-orange-500 to-amber-500',
  },
  Thumb_Down: {
    label: 'رد کردن سوال',
    type: 'SKIP',
    emoji: '👎',
    color: 'from-rose-500 to-red-500',
  },
  Pointing_Up: {
    label: 'سوال بعدی',
    type: 'NEXT',
    emoji: '☝️',
    color: 'from-indigo-500 to-blue-500',
  },
};

export const SUPPORTED_GESTURES = Object.keys(GESTURE_ACTIONS);

export const gestureNameFa = {
  None: 'بدون ژست',
  Closed_Fist: 'مشت بسته',
  Open_Palm: 'کف دست باز',
  Pointing_Up: 'اشاره به بالا',
  Thumb_Down: 'شست پایین',
  Thumb_Up: 'شست بالا',
  Victory: 'علامت پیروزی',
  ILoveYou: 'I Love You',
};
