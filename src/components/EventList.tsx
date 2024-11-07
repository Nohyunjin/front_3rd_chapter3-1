import { Event } from '../types';
import { EventItem } from './EventItem';

interface EventItemsProps {
  events: Event[];
  notifiedEvents: string[];
  onEdit: () => void;
  onDelete: () => void;
}

export const EventList = ({ events, notifiedEvents, onEdit, onDelete }: EventItemsProps) => {
  return (
    <>
      {events.map((event) => (
        <EventItem
          key={event.id}
          event={event}
          isNotified={notifiedEvents.includes(event.id)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </>
  );
};
