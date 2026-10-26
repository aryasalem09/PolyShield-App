'use client';
import { useEffect, useState } from 'react';
import { readLocalProgress } from '@/lib/upbranch/progress';
export function MissionStatus({id}:{id:string}) { const [done,setDone]=useState(false); useEffect(()=>setDone(readLocalProgress().completedMissionIds.includes(id)),[id]); return done ? <span className="ml-2 text-xs font-bold">✓ Completed</span> : null; }
