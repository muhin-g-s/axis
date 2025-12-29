import { RegistrationForm } from '@/modules/identity'
import { css } from '@/shared/ui/styled-system/css'
import { Box, Heading } from '@chakra-ui/react'

const cardStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '8',
  w: 'full',
  maxW: 'md',
  p: '8',
  bg: 'white',
  rounded: '2xl',
  shadow: 'xl',
  border: '1px solid',
  borderColor: 'gray.200',
  backdropFilter: 'blur(8px)',
  position: 'relative',
  zIndex: 1,
  transition: 'all 0.2s ease',
  _hover: {
    shadow: '2xl',
  },
})

export default function RegistrationPage() {
  return (
		<div className={cardStyle}>
			<Box>
				<Heading
					size="lg"
					textAlign="center"
					fontWeight="bold"
					color="gray.800"
					mb="2"
				>
					Create Account
				</Heading>

				<Box fontSize="sm" color="gray.600" textAlign="center">
					Join our community and start managing your tasks
				</Box>
			</Box>

			<Box w="full">
				<RegistrationForm />
			</Box>
		</div>
  )
}
