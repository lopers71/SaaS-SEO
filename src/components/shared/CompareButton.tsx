import { Button } from '@chakra-ui/react'
import { FaCodeCompare } from 'react-icons/fa6'

interface CompareButtonProps {
  onClick: () => void
}

export default function CompareButton({ onClick }: CompareButtonProps) {
  return (
    <Button
      leftIcon={<FaCodeCompare />}
      colorScheme="purple"
      variant="outline"
      onClick={onClick}
    >
      Compare Results
    </Button>
  )
} 