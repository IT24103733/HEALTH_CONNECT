import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, VStack, HStack, Text, Icon, Box } from '@chakra-ui/react'
import { FaHome, FaCalendarCheck, FaHistory, FaHeadset } from 'react-icons/fa'
import { useState } from 'react'

export default function DoctorOnboarding({ isOpen, onClose }) {
  const [step, setStep] = useState(0)

  const steps = [
    { icon: FaHome, title: 'Dashboard', desc: 'View today\'s appointments, track your revenue, and manage your reminders to stay organized' },
    { icon: FaCalendarCheck, title: 'Pending Appointments', desc: 'Review and manage appointment requests from patients. Accept or reject appointments as needed' },
    { icon: FaHistory, title: 'Past Appointments', desc: 'Access your complete appointment history with patient details and consultation notes' },
    { icon: FaHeadset, title: 'Get Support', desc: 'Contact our support team via phone, email, or live chat for any assistance you need' }
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
