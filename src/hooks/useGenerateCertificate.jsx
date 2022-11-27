import React, { useState } from 'react';
import { toPng } from 'html-to-image';

import BorderLeft from '../assets/certificate/border-left.svg';
import BorderRight from '../assets/certificate/border-right.svg';
import Badge from '../assets/certificate/badge.svg';

const useGenerateCertificate = (certificate) => {
  const ref = React.useRef();

  const generate = () => {
    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${certificate.profile.name && certificate.profile.name.toLowerCase().replaceAll(' ', '-')}-${certificate.category}.jpg`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const certificateHTML = () => (
    <div ref={ref} className={`relative w-[800px] h-[560px] bg-gray-50 flex flex-col justify-center items-center p-10`}>
      <img className='absolute top-0 left-0 w-[500px] h-100' src={BorderLeft} alt='Border-Left' />
      <img className='absolute top-0 right-0 w-[400px] h-100' src={BorderRight} alt='Border-Right' />
      <img className='absolute bottom-12 right-20 h-12 w-12' src='/certify.svg' alt='Certify' />

      <div className='h-full mt-24'>
        <div className='text-sky-800 text-right w-full'>
          <h1 className='font-semibold text-4xl uppercase'>Certificate</h1>
          <h2>OF ACHIEVEMENT</h2>
        </div>
        <div className='flex space-x-10 mt-20'>
          <div className='border-r-4 border-[#28788F] pr-10 w-1/5'>
            <img src={Badge} className='w-40 h-40' alt='Badge' />
          </div>
          <div className='text-sky-800 space-y-4 w-4/5'>
            <h2 className=''>This certificate is presented to</h2>
            <h1 className='text-4xl text-black'>{certificate.profile.name}</h1>
            <p className='text-sm'>on successfully passing the {certificate.category.replace('-', ' ').toUpperCase()} Exam. </p>
          </div>
        </div>
        <div className='mt-8 w-full flex justify-between px-40'>
          <div>
            <h2 className='font-bold border-b border-gray-500'>Ali Raza Bukhari</h2>
            <p className='text-sm'>CEO</p>
          </div>

          <div>
            <h2 className='font-bold border-b border-gray-500'>Certify</h2>
            <p className='text-sm'>Company</p>
          </div>
        </div>
      </div>
    </div>
  );

  return [generate, certificateHTML];
};

export default useGenerateCertificate;
