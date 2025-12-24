import {Children, ReactNode} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { isAuthenticated } from '@/lib/actions/auth.action';
// import { redirect } from 'next/dist/server/api-utils';
import { redirect } from 'next/navigation';


const Rootlayout = async ({children}:{children: ReactNode}) => {
    const isUserAuthenticated = await isAuthenticated(); 
    if(!isUserAuthenticated) redirect('/sign-in');
  return (
    <div className='root-layout'>
      <nav>
        <Link href="/" className="flex items-center gap-3" >
          <Image src="/logo.svg" alt="Logo" width={38} height={32} className="logo" />
          <span className="text-2xl font-bold text-primary-100">Interview Prep</span>
        </Link>
      </nav>
      <div className="mt-8">{/* Add margin-top for gap */}
        {children}
      </div>
    </div>
  )
}

export default Rootlayout