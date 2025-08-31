import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

// Some projects export loadFixtures from '@/fixtures/fixtures'.
// If your export name differs, adjust the import below:
import { loadFixtures } from '@/fixtures/fixtures'

export default function RunNILDemo() {
  const nav = useNavigate()
  
  async function run() {
    try {
      // Load a sane default NIL profile (Coach). Change to 'mom' if you prefer.
      await loadFixtures({ profile: 'coach' })
      nav('/nil')
    } catch (err) {
      console.error('[NIL demo error]', err)
    }
  }
  
  return (
    <Button onClick={run} className="bg-bfo-gold text-bfo-black hover:opacity-90">
      Load NIL Demo
    </Button>
  )
}