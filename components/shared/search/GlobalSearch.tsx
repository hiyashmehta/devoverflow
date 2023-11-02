"use client"

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'
import GlobalResult from './GlobalResult'


const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchContainerRef = useRef(null);

  const query = searchParams.get('global');
  const [ search, setSearch ] = useState(query || '');
  const [ isOpen, setIsOpen ] = useState(false)

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if(searchContainerRef.current.contains(event.target))
    } {
  setIsOpen(false);
  setSearch('')
}
setIsOpen(false);
document.addEventListener('mousedown', handleOutsideClick);
return () ={
  document.removeEventListener('mousedown', handleOutsideClick);

}
}, [pathname])

  useEffect(() => {
    const delayDebounceFn = setTimeout(()=> {
      if(search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'global',
          value: search
        })

        router.push(newUrl, { scroll: false});
      } else {
        if(query){
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['global', 'type']
          })

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn)
  }, [search, pathname, router, searchParams, query])

  return (
    <div className='relative w-full max-w-[600px] max-lg:hidden' ref={searchContainerRef}>
        <div className='background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-4 rounded-xl px-4'>
            <Image
                src="/assets/icons/Search.svg"
                alt='Search'
                width={24}
                height={24}
                className='cursor-pointer'
            />
            <Input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);

                  if(!isOpen) setIsOpen(true);
                  if(!e.target.value) setIsOpen(false);
                }}
                placeholder='Search globally'
                className='paragraph-regular no-focus placeholder background-light800_darkgradient text-dark400_light700 border-none shadow-none outline-none'
            />
        </div>
        { isOpen && <GlobalResult /> }
    </div>
  )
}

export default GlobalSearch