'use client'

// Component Imports
import TestAssessmentCreate from '@/features/test/create'

type Props = {
  params: { id: string }
}

const TestCreateApp = ({ params }: Props) => {
  const isEdit = params.id !== 'new'
  const testId = isEdit ? params.id : null

  return <TestAssessmentCreate id={testId} isEdit={isEdit} />
}

export default TestCreateApp