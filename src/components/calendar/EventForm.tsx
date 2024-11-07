// components/Calendar/EventForm.tsx
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  useToast,
  VStack,
} from '@chakra-ui/react';

import { CATEGORIES, NOTIFICATION_OPTIONS } from '../../constants/calendar';
import { useEventForm } from '../../hooks/useEventForm';
import { Event, EventForm as EventFormType } from '../../types';
import { RepeatForm } from '../RepeatForm';
import { TimeInputs } from '../TimeInputs';

interface EventFormProps {
  event?: Event;
  onSubmit: () => void;
  onCancel: () => void;
}

export const EventForm = ({ event, onSubmit, onCancel }: EventFormProps) => {
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
    validateForm,
  } = useEventForm(event);

  const toast = useToast();

  const handleSubmit = () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      toast({
        title: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const eventData: EventFormType = {
      id: event?.id,
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
    };

    onSubmit(eventData);
  };

  return (
    <VStack w="400px" spacing={5} align="stretch">
      <Heading>{event ? '일정 수정' : '일정 추가'}</Heading>

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

      <HStack spacing={4}>
        <Button
          onClick={handleSubmit}
          colorScheme="blue"
          flex={1}
          data-testid="event-submit-button"
        >
          {event ? '일정 수정' : '일정 추가'}
        </Button>
        {event && (
          <Button onClick={onCancel} variant="outline" flex={1}>
            취소
          </Button>
        )}
      </HStack>
    </VStack>
  );
};
