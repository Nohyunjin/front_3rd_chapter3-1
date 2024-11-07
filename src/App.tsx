import { Box, Flex } from '@chakra-ui/react';
import { useRef, useState } from 'react';

import { useNotifications } from './hooks/useNotifications.ts';
import { Event } from './types';
import { findOverlappingEvents } from './utils/eventOverlap';

import { CalendarContainer } from './components/calendar/CalendarContainer.tsx';
import { EventDialog } from './components/EventDialog.tsx';
import { EventFormContainer } from './components/EventForm.tsx';
import { EventList } from './components/EventList.tsx';
import { EventNotification } from './components/EventNotification.tsx';
import { useEventOperations } from './hooks/useEventOperations.ts';

function App() {
  const { events, saveEvent, deleteEvent } = useEventOperations();
  const { notifications, notifiedEvents, setNotifications } = useNotifications(events);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleEventSubmit = async (eventData: EventForm) => {
    const overlapping = findOverlappingEvents(eventData, events);
    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
      setIsOverlapDialogOpen(true);
    } else {
      await saveEvent(eventData);
      setEditingEvent(null);
    }
  };

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <EventFormContainer editingEvent={editingEvent} onSubmit={handleEventSubmit} />

        <CalendarContainer events={events} notifiedEvents={notifiedEvents} />

        <EventList
          events={events}
          notifiedEvents={notifiedEvents}
          onEdit={setEditingEvent}
          onDelete={deleteEvent}
        />
      </Flex>

      <EventDialog
        isOpen={isOverlapDialogOpen}
        onClose={() => setIsOverlapDialogOpen(false)}
        onConfirm={async () => {
          setIsOverlapDialogOpen(false);
          if (editingEvent) {
            await saveEvent(editingEvent);
            setEditingEvent(null);
          }
        }}
        overlappingEvents={overlappingEvents}
        cancelRef={cancelRef}
      />

      <EventNotification
        notifications={notifications}
        onClose={(index) => setNotifications((prev) => prev.filter((_, i) => i !== index))}
      />
    </Box>
  );
}

export default App;
