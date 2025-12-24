import Agent from '@/components/Agent'
import { CallStatus } from '@/constants'
import React from 'react'

const page = () => {
  return (
    <>
      <h3>Interview Generation</h3>
      {/* Demo with an active call so the "End" button is visible */}
      <Agent userName="You" userId="user1" type="generate" initialStatus={CallStatus.ACTIVE} />
    </>
  )
}


export default page