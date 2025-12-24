"use client"

import React, { useState } from 'react'
import Image from 'next/image';
import { CallStatus } from '@/constants';
import { cn } from '@/lib/utils'


interface AgentProps {
  userName?: string;
  initialStatus?: CallStatus;
  userId?: string;
  type?: string;
}

const Agent = ({ userName = 'You', initialStatus = CallStatus.INACTIVE }: AgentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(initialStatus);
  const isSpeaking = callStatus === CallStatus.ACTIVE; // dynamic in real app
  const message = [
    'Whats your name?',
    'My name is John Doe, nice to meet you!'
  ];
  const lastMessage = message[message.length - 1];
     
  const handlePrimary = () => {
    if (callStatus === CallStatus.ACTIVE) {
      // End call
      setCallStatus(CallStatus.FINISHED);
    } else {
      // Start or retry call
      setCallStatus(CallStatus.CONNECTING);
      // Simulate connecting -> active
      setTimeout(() => setCallStatus(CallStatus.ACTIVE), 800);
    }
  };

  return (
    <>
      <div className='call-view'>
        <div className="card-interviewer">
          <div className="avatar">
            <Image src="/ai-avatar.png" alt="Vapi" width={65} height={54} className="object-cover"/>
            {isSpeaking && <div className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>
        <div className="card-border">
          <div className="card-content">
            <Image src="/user-avatar.png" alt="user avatar" width={540} height={540} className=" rounded-full object-cover size-{120px}"/>
            <h3>{userName}</h3>
          </div>
        </div>
      </div>
       {message.length > 0 && (
        <div className="transcript-border">
            <div className="transcript">
                <p key={lastMessage} className = {cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                    {lastMessage}

                </p>
                
            </div>
        </div>
      )}

      <div className="w-full flex justify-center mt-8">
        {callStatus !== CallStatus.ACTIVE ? (
          <button onClick={handlePrimary} className="btn-primary">
            <span>
              {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED ? 'Call' : 'Connecting...'}
            </span>
          </button>
        ) : (
          <button onClick={handlePrimary} className="btn-disconnect">
            End
          </button>
        )}
      </div>
    </>
  )
}

export default Agent