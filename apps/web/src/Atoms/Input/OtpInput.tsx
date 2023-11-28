import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';

interface OtpProps {
  getValue: (value: string) => void;
}

let currentOtpIndex: number = 0;
const OtpInput: FC<OtpProps> = ({ getValue }) => {
  const array = new Array(5).fill('');
  const [otpArray, setOtpArray] = useState<string[]>(array);
  const [activeIndex, setActiveIndex] = useState(0);

  const InputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newOtp: string[] = [...otpArray];
    newOtp[currentOtpIndex] = value.substring(value.length - 1);

    if (!value) setActiveIndex(currentOtpIndex - 1);
    else setActiveIndex(currentOtpIndex + 1);
    setOtpArray(newOtp);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    currentOtpIndex = index;
    if (e.key === 'Backspace') {
      setActiveIndex(currentOtpIndex - 1);
    }
  };

  useEffect(() => {
    InputRef.current?.focus();
    const values: string = otpArray.join('');
    getValue(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, otpArray]);

  return (
    <div className='flex place-items-center justify-between gap-2 m-2'>
      {otpArray.map((v, i) => (
        <input
          key={i}
          ref={activeIndex === i ? InputRef : null}
          type='text'
          className='w-10 h-10  md:w-12 md:h-12 rounded-md text-center text-xl outline-[1px]  outline-black bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg dark:outline-white'
          onChange={(e) => {
            handleChange(e);
          }}
          onKeyDown={(e) => handleKeyDown(e, i)}
          value={otpArray[i]}
        />
      ))}
    </div>
  );
};

export default OtpInput;
