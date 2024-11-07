import { Heading, VStack } from '@chakra-ui/react';

import { CalendarHeader } from './CalendarHeader';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { useCalendarView } from '../../hooks/useCalendarView';

interface CalendarContainerProps {
  events: Event[];
  notifiedEvents: string[];
}

export const CalendarContainer = ({ events, notifiedEvents }: CalendarContainerProps) => {
  const { view, setView, currentDate, holidays, navigate } = useCalendarView();

  return (
    <VStack flex={1} spacing={5} align="stretch">
      <Heading>일정 보기</Heading>
      <CalendarHeader view={view} onViewChange={setView} onNavigate={navigate} />
      {view === 'week' ? (
        <WeekView currentDate={currentDate} events={events} notifiedEvents={notifiedEvents} />
      ) : (
        <MonthView
          currentDate={currentDate}
          events={events}
          notifiedEvents={notifiedEvents}
          holidays={holidays}
        />
      )}
    </VStack>
  );
};
