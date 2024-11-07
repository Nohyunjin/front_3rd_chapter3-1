import { Event, EventForm } from '../types';

interface ValidateEventResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validateEventData = (
  title: string,
  date: string,
  startTime: string,
  endTime: string,
  startTimeError: string | null,
  endTimeError: string | null
): ValidateEventResult => {
  if (!title || !date || !startTime || !endTime) {
    return {
      isValid: false,
      errorMessage: '필수 정보를 모두 입력해주세요.',
    };
  }

  if (startTimeError || endTimeError) {
    return {
      isValid: false,
      errorMessage: '시간 설정을 확인해주세요.',
    };
  }

  return { isValid: true };
};

export const createEventData = (
  editingEvent: Event | null,
  formData: Omit<EventForm, 'id'>
): EventForm => {
  return {
    id: editingEvent?.id,
    ...formData,
  };
};
