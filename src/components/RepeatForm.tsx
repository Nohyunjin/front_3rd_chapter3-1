import { FormControl, FormLabel, HStack, Input, Select, VStack } from '@chakra-ui/react';
import { RepeatType } from '../types';

interface RepeatFormProps {
  repeatType: RepeatType;
  repeatInterval: number;
  repeatEndDate: string;
  startDate: string;
  onRepeatTypeChange: (type: RepeatType) => void;
  onRepeatIntervalChange: (interval: number) => void;
  onRepeatEndDateChange: (date: string) => void;
}

export const RepeatForm = ({
  repeatType,
  repeatInterval,
  repeatEndDate,
  startDate,
  onRepeatTypeChange,
  onRepeatIntervalChange,
  onRepeatEndDateChange,
}: RepeatFormProps) => {
  return (
    <VStack spacing={4}>
      <FormControl>
        <FormLabel>반복 유형</FormLabel>
        <Select
          value={repeatType}
          onChange={(e) => onRepeatTypeChange(e.target.value as RepeatType)}
        >
          <option value="daily">매일</option>
          <option value="weekly">매주</option>
          <option value="monthly">매월</option>
          <option value="yearly">매년</option>
        </Select>
      </FormControl>

      <HStack width="100%">
        <FormControl>
          <FormLabel>반복 간격</FormLabel>
          <Input
            type="number"
            value={repeatInterval}
            onChange={(e) => onRepeatIntervalChange(Number(e.target.value))}
            min={1}
          />
        </FormControl>

        <FormControl>
          <FormLabel>반복 종료일</FormLabel>
          <Input
            type="date"
            value={repeatEndDate}
            onChange={(e) => onRepeatEndDateChange(e.target.value)}
            min={startDate}
          />
        </FormControl>
      </HStack>
    </VStack>
  );
};
