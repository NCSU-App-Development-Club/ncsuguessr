import { Modal, Text, TouchableOpacity, View } from 'react-native'

const GameEventModal = ({
  open,
  setOpen,
  onClose,
  title,
  message,
  subMessage,
}: {
  open: boolean
  setOpen: (s: boolean) => void
  onClose?: () => void
  title: string
  message: string
  subMessage?: string
}) => {
  return (
    <Modal visible={open} transparent={true} animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)' }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 24,
              borderRadius: 16,
              width: '80%',
              maxWidth: 320,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              display: 'flex',
              gap: 10,
            }}
          >
            <Text className="text-2xl font-bold">{title}</Text>
            <Text className="text-lg text-center">{message}</Text>
            {subMessage ? (
              <Text className="text-base text-center text-gray-600">
                {subMessage}
              </Text>
            ) : null}
            <TouchableOpacity
              onPress={() => {
                setOpen(false)
                onClose?.()
              }}
              style={{ width: '100%' }}
            >
              <View
                style={{
                  backgroundColor: '#CC0000',
                  borderRadius: 9999,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                }}
              >
                <Text className="text-white text-center font-bold text-lg">
                  Continue
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default GameEventModal
