import { ButtonHTMLAttributes } from 'react';

export const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className="border border-white bg-black text-white font-mono px-4 py-2 w-fit hover:bg-[#171717] active:scale-90"
    {...props}
  />
);
