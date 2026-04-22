import { useMemo } from 'react'
import { useProgress } from '../context/ProgressContext'
import ModuleLearningPage from '../components/modules/ModuleLearningPage'
import { buildAdditionalModuleItems } from '../data/additionalModules'

export default function AdditionalModulePage({ moduleId }) {
  const { map, toggleDone, saveQuestionNotes, saveQuestionFlags, toggleFavorite } = useProgress()
  const items = useMemo(() => buildAdditionalModuleItems(moduleId), [moduleId])

  return (
    <ModuleLearningPage
      moduleId={moduleId}
      items={items}
      map={map}
      toggleDone={toggleDone}
      saveQuestionNotes={saveQuestionNotes}
      saveQuestionFlags={saveQuestionFlags}
      toggleFavorite={toggleFavorite}
    />
  )
}
