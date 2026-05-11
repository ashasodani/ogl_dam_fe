'use client'

import React from 'react'
import MCQAssessmentCreate from '@/features/mcq/create'

type Props = {
  params: Promise<{ id: string }> | { id: string } // handle both cases
}

const MCQCreateApp = ({ params }: Props) => {
  // ✅ Safely handle both promise and object
  const [resolvedParams, setResolvedParams] = React.useState<{ id: string } | null>(null)

  React.useEffect(() => {
    const unwrap = async () => {
      if (params instanceof Promise) {
        const result = await params
        
        setResolvedParams(result)
      } else {
        setResolvedParams(params)
      }
    }
    unwrap()
  }, [params])

  if (!resolvedParams) return null // or a loader

  const { id } = resolvedParams
  const isEdit = id !== 'new'
  const mcqId = isEdit ? id : null

  return <MCQAssessmentCreate id={mcqId} isEdit={isEdit} />
}

export default MCQCreateApp
