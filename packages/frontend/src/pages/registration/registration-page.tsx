import { RegistrationForm } from '@/modules/registration'
import { css } from '@/shared/ui/styled-system/css'
import { Box, Heading } from '@chakra-ui/react'

const containerStyle = css({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bg: 'radial-gradient(circle at top left, #667eea 0%, #764ba2 100%)',
  p: { base: '4', md: '8' },
  position: 'relative',
  overflow: 'hidden',
})

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
    transform: 'translateY(-5px)',
    shadow: '2xl',
  },
})

const floatingBlobStyle = css({
  position: 'absolute',
  rounded: 'full',
  opacity: 0.3,
  filter: 'blur(25px)',
})

export default function RegistrationPage() {
  return (
		<div className={containerStyle}>
			<Box
				className={floatingBlobStyle}
				top="-50px"
				right="-50px"
				w="150px"
				h="150px"
				bg="linear(to-r, #ff9a9e, #fad0c4)"
			/>

			<Box
				className={floatingBlobStyle}
				bottom="-80px"
				left="-50px"
				w="200px"
				h="200px"
				bg="linear(to-r, #a1c4fd, #c2e9fb)"
			/>

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
		</div>
  )
}
