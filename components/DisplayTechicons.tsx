"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn, getTechLogos } from '@/lib/utils';

type TechIcon = { tech: string; url: string };
type TechIconProps = { techStack: string[] };

const DisplayTechicons = ({ techStack }: TechIconProps) => {
  const [techIcons, setTechIcons] = useState<TechIcon[]>([]);

  useEffect(() => {
    async function fetchIcons() {
      const icons = await getTechLogos(techStack);
      setTechIcons(icons);
    }
    fetchIcons();
  }, [techStack]);

  return (
    <div className='flex flex-row gap-2'>
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div key={tech} className="relative group bg--300 rounded-full p-3 flex-center">
          <span className="tech-tooltip">{tech}</span>
          <Image src={url} alt={tech} width={100} height={100} className='size-5'/>
        </div>
      ))}
    </div>
  );
};

export default DisplayTechicons;