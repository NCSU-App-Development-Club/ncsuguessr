import { DateData, MarkedDates } from 'react-native-calendars/src/types'
import { Day } from '../../util/time/day'
import { View } from 'react-native'
import Text from '../global/Text'
import { Calendar } from 'react-native-calendars'

export const GameSelectCalendar = ({
  gameDatesLoading,
  error,
  today,
  markedDates,
  selectedDate,
  setSelectedDate,
}: {
  gameDatesLoading: boolean
  error: string | null
  today: Day
  markedDates: MarkedDates
  selectedDate: Day
  setSelectedDate: (d: Day) => void
}) => {
  return gameDatesLoading ? (
    <View>
      <Text className="text-center">Loading games...</Text>
    </View>
  ) : error ? (
    <View>
      <Text className="text-center">Error: {error}</Text>
    </View>
  ) : (
    <View className="bg-white rounded-2xl overflow-hidden p-4">
      <Calendar
        initialDate={today.toString()}
        disableAllTouchEventsForDisabledDays={true}
        theme={{
          selectedDayBackgroundColor: '#CC0000',
          dotColor: '#CC0000',
          arrowColor: '#CC0000',
        }}
        onDayPress={(day: DateData) => {
          setSelectedDate(new Day(day.year, day.month, day.day))
        }}
        markedDates={{
          ...markedDates,
          [selectedDate.toString()]: {
            ...markedDates[selectedDate.toString()],
            selected: true,
            disableTouchEvent: true,
          },
        }}
        maxDate={today.toString()}
        minDate="2025-05-01"
      />
    </View>
  )
}
