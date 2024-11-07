import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  useToast,
  VStack,
} from '@chakra-ui/react';

import { CATEGORIES, NOTIFICATION_OPTIONS } from '../constants/calendar';
import { useEventForm } from '../hooks/useEventForm';
import { Event, EventForm as EventFormType } from '../types';
import { RepeatForm } from './RepeatForm.tsx';
import { TimeInputs } from './TimeInputs.tsx';
import { createEventData, validateEventData } from '../utils/eventHandlers';

interface EventFormContainerProps {
  editingEvent: Event | null;
  onSubmit: (eventData: EventFormType) => Promise<void>;
}

export const EventFormContainer = ({ editingEvent, onSubmit }: EventFormContainerProps) => {
  const {
    title,
    setTitle,
    date,
    setDate,
    startTime,
    endTime,
    description,
    setDescription,
    location,
    setLocation,
    category,
    setCategory,
    isRepeating,
    setIsRepeating,
    repeatType,
    setRepeatType,
    repeatInterval,
    setRepeatInterval,
    repeatEndDate,
    setRepeatEndDate,
    notificationTime,
    setNotificationTime,
    startTimeError,
    endTimeError,
    handleStartTimeChange,
    handleEndTimeChange,
    resetForm,
  } = useEventForm(editingEvent);

  const toast = useToast();

  const handleSubmit = async () => {
    const validation = validateEventData(
      title,
      date,
      startTime,
      endTime,
      startTimeError,
      endTimeError
    );

    if (!validation.isValid) {
      toast({
        title: validation.errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const eventData = createEventData(editingEvent, {
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeat: {
        type: isRepeating ? repeatType : 'none',
        interval: repeatInterval,
        endDate: repeatEndDate || undefined,
      },
      notificationTime,
    });

    await onSubmit(eventData);
    resetForm();
  };

  return (
    <VStack w="400px" spacing={5} align="stretch">
      <Heading>{editingEvent ? '일정 수정' : '일정 추가'}</Heading>

      <FormControl isRequired>
        <FormLabel>제목</FormLabel>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="일정 제목을 입력하세요"
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>날짜</FormLabel>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </FormControl>

      <TimeInputs
        startTime={startTime}
        endTime={endTime}
        startTimeError={startTimeError}
        endTimeError={endTimeError}
        onStartTimeChange={handleStartTimeChange}
        onEndTimeChange={handleEndTimeChange}
      />

      <FormControl>
        <FormLabel>설명</FormLabel>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="일정에 대한 설명을 입력하세요"
        />
      </FormControl>

      <FormControl>
        <FormLabel>위치</FormLabel>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="일정 장소를 입력하세요"
        />
      </FormControl>

      <FormControl>
        <FormLabel>카테고리</FormLabel>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="카테고리를 선택하세요"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>반복 설정</FormLabel>
        <Checkbox isChecked={isRepeating} onChange={(e) => setIsRepeating(e.target.checked)}>
          반복 일정
        </Checkbox>
      </FormControl>

      {isRepeating && (
        <RepeatForm
          repeatType={repeatType}
          repeatInterval={repeatInterval}
          repeatEndDate={repeatEndDate}
          startDate={date}
          onRepeatTypeChange={setRepeatType}
          onRepeatIntervalChange={setRepeatInterval}
          onRepeatEndDateChange={setRepeatEndDate}
        />
      )}

      <FormControl>
        <FormLabel>알림 설정</FormLabel>
        <Select
          value={notificationTime}
          onChange={(e) => setNotificationTime(Number(e.target.value))}
        >
          {NOTIFICATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormControl>

      <Button onClick={handleSubmit} colorScheme="blue" data-testid="event-submit-button">
        {editingEvent ? '일정 수정' : '일정 추가'}
      </Button>
    </VStack>
  );
};
