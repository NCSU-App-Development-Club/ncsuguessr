import { Image } from 'react-native'
import { Day } from '../../util/time/day'
import Button from '../global/Button'
import { Router } from 'expo-router'

export const PlayButton = ({
  selectedGameExists,
  selectedGamePlayed,
  gameDatesLoading,
  selectedDate,
  today,
  router,
}: {
  selectedGameExists: boolean
  selectedGamePlayed: boolean
  gameDatesLoading: boolean
  selectedDate: Day
  today: Day
  router: Router
}) => {
  return (
    <Button
      onPress={
        selectedGameExists && !selectedGamePlayed
          ? () => router.push(`/games/play/${selectedDate.toString()}`)
          : undefined
      }
      title={
        gameDatesLoading
          ? 'Loading...'
          : selectedGameExists
            ? selectedGamePlayed
              ? 'Already Played'
              : selectedDate.equals(today)
                ? 'Play'
                : 'Play Selected'
            : 'No Game'
      }
      variant="primary"
      size="xl"
      fullWidth
      icon={
        <Image
          source={
            selectedGameExists
              ? selectedGamePlayed
                ? require('../../assets/disallowed.png')
                : require('../../assets/play.png')
              : require('../../assets/clock.png')
          }
          style={{ width: 36, height: 36 }}
        />
      }
      baseOpacity={0.9}
      textClassName="font-bold"
    />
  )
}
