import { useMemo } from 'react'
import ModuleLearningPage from '../components/modules/ModuleLearningPage'
import { useProgress } from '../context/ProgressContext'
import { dsaSheets } from '../data/dsa'
import { normalizeModuleItems } from '../lib/moduleItems'

export default function DsaTopicPage() {
  const { map, toggleDone, saveQuestionNotes } = useProgress()
  const items = useMemo(
    () =>
      normalizeModuleItems(
        'dsa',
        dsaSheets.flatMap((sheet) => sheet.questions ?? [])
      ),
    []
  )

  return (
    <ModuleLearningPage
      moduleId="dsa"
      items={items}
      map={map}
      toggleDone={toggleDone}
      saveQuestionNotes={saveQuestionNotes}
    />
  )
}
