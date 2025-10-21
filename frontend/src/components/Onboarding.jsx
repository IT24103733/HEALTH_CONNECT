import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, VStack, HStack, Text, Icon, Box } from '@chakra-ui/react'
import { FaHome, FaCalendarAlt, FaUtensils, FaHeadset } from 'react-icons/fa'
import { useState } from 'react'

export default function Onboarding({ isOpen, onClose }) {
  const [step, setStep] = useState(0)

  const steps = [
    { icon: FaHome, title: 'Dashboard', desc: 'View your next appointment, track health metrics, and manage your checklist' },
    { icon: FaCalendarAlt, title: 'Book Appointment', desc: 'Schedule appointments with doctors and dietitians' },
    { icon: FaUtensils, title: 'Diet Plan Request', desc: 'Get a free diet plan or request personalized guidance from our dietitians. If you need proper guidance, you can book a dietitian appointment!' },
    { icon: FaHeadset, title: 'Get Support', desc: 'Contact support team via phone, email, or chat' }
  ]

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1)
    else onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Welcome to Health Connect!</ModalHeader>
        <ModalBody>
          <VStack spacing={6} align="center" py={6}>
            <Box p={6} bg="brand.50" rounded="full">
              <Icon as={steps[step].icon} boxSize={16} color="brand.500" />
            </Box>
            <Text fontSize="2xl" fontWeight="bold">{steps[step].title}</Text>
            <Text textAlign="center" color="gray.600">{steps[step].desc}</Text>
            <HStack spacing={2}>
              {steps.map((_, i) => (
                <Box key={i} w={2} h={2} rounded="full" bg={i === step ? 'brand.500' : 'gray.300'} />
              ))}
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Skip</Button>
          <Button bgGradient="linear(to-r, brand.500, purple.400)" color="white" onClick={handleNext}>
            {step < steps.length - 1 ? 'Next' : 'Get Started'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
