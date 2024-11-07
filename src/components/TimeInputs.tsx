import { FormControl, FormLabel, HStack, Input, Tooltip } from '@chakra-ui/react';

interface TimeInputsProps {
  startTime: string;
  endTime: string;
  startTimeError: string | null;
  endTimeError: string | null;
  onStartTimeChange: () => void;
  onEndTimeChange: () => void;
}

export const TimeInputs = ({
  startTime,
  endTime,
  startTimeError,
  endTimeError,
  onStartTimeChange,
  onEndTimeChange,
}: TimeInputsProps) => {
  return (
    <HStack width="100%">
      <FormControl isRequired>
        <FormLabel>시작 시간</FormLabel>
        <Tooltip label={startTimeError} isOpen={!!startTimeError} placement="top">
          <Input
            type="time"
            value={startTime}
            onChange={onStartTimeChange}
            isInvalid={!!startTimeError}
          />
        </Tooltip>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>종료 시간</FormLabel>
        <Tooltip label={endTimeError} isOpen={!!endTimeError} placement="top">
          <Input
            type="time"
            value={endTime}
            onChange={onEndTimeChange}
            isInvalid={!!endTimeError}
          />
        </Tooltip>
      </FormControl>
    </HStack>
  );
};
