import { Event, EventForm } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const date = parseDateTime('2024-07-01', '14:30');
    expect(date).toEqual(new Date('2024-07-01T14:30'));
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const date = parseDateTime('2024-07-32', '14:30');
    expect(date).toEqual(new Date('Invalid Date'));
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const date = parseDateTime('2024-07-01', '25:30');
    expect(date).toEqual(new Date('Invalid Date'));
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const date = parseDateTime('', '14:30');
    expect(date).toEqual(new Date('Invalid Date'));
  });
});

describe('convertEventToDateRange', () => {
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const event: Event = {
      id: '1',
      title: '주간 회의',
      description: '팀 업무 논의',
      location: '회의실 A',
      date: '2024-01-15',
      startTime: '10:00',
      endTime: '11:00',
      category: '회의',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 30,
    };
    const dateRange = convertEventToDateRange(event);
    expect(dateRange).toEqual({
      start: new Date('2024-01-15T10:00:00'),
      end: new Date('2024-01-15T11:00:00'),
    });
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const event: Event = {
      id: '1',
      title: '주간 회의',
      description: '팀 업무 논의',
      location: '회의실 A',
      date: '2024-13-45',
      startTime: '10:00',
      endTime: '11:00',
      category: '회의',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 30,
    };
    const dateRange = convertEventToDateRange(event);
    expect(dateRange).toEqual({
      start: new Date('Invalid Date'),
      end: new Date('Invalid Date'),
    });
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const event: Event = {
      id: '1',
      title: '주간 회의',
      description: '팀 업무 논의',
      location: '회의실 A',
      date: '2024-01-15',
      startTime: '25:00',
      endTime: '11:00',
      category: '회의',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 30,
    };
    const dateRange = convertEventToDateRange(event);
    expect(dateRange).toEqual({
      start: new Date('Invalid Date'),
      end: new Date('2024-01-15T11:00:00'),
    });
  });
});

describe('isOverlapping', () => {
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    const event1: Event = {
      id: '1',
      title: '주간 회의',
      description: '팀 업무 논의',
      location: '회의실 A',
      date: '2024-01-15',
      startTime: '10:00',
      endTime: '11:00',
      category: '회의',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 30,
    };

    const event2: Event = {
      id: '2',
      title: '점심 식사',
      description: '팀 회식',
      location: '레스토랑',
      date: '2024-01-15',
      startTime: '10:30',
      endTime: '12:00',
      category: '회식',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 30,
    };

    const result = isOverlapping(event1, event2);
    expect(result).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    const event1: Event = {
      id: '1',
      title: '주간 회의',
      description: '팀 업무 논의',
      location: '회의실 A',
      start: new Date('2024-01-15T10:00:00'),
      end: new Date('2024-01-15T11:00:00'),
    };
    const event2: Event = {
      id: '2',
      title: '점심 식사',
      description: '팀 회식',
      location: '레스토랑',
      start: new Date('2024-01-15T12:00:00'),
      end: new Date('2024-01-15T13:00:00'),
    };
    const result = isOverlapping(event1, event2);
    expect(result).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    // 기존 이벤트 배열 설정
    const events: Event[] = [
      {
        id: '1',
        title: '미팅 A',
        date: '2024-03-15',
        startTime: '10:00',
        endTime: '11:00',
      },
      {
        id: '2',
        title: '미팅 B',
        date: '2024-03-15',
        startTime: '11:30',
        endTime: '12:30',
      },
      {
        id: '3',
        title: '미팅 C',
        date: '2024-03-15',
        startTime: '14:00',
        endTime: '15:00',
      },
    ];

    // 새로운 이벤트 (미팅 A, B와 겹치는 시간)
    const newEvent: EventForm = {
      title: '새 미팅',
      date: '2024-03-15',
      startTime: '10:30',
      endTime: '12:00',
    };

    const overlappingEvents = findOverlappingEvents(newEvent, events);

    // 미팅 A, B와 겹쳐야 함
    expect(overlappingEvents).toHaveLength(2);
    expect(overlappingEvents).toContainEqual(events[0]); // 미팅 A
    expect(overlappingEvents).toContainEqual(events[1]); // 미팅 B
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const events: Event[] = [
      {
        id: '1',
        title: '오전 미팅',
        date: '2024-03-15',
        startTime: '09:00',
        endTime: '10:00',
      },
      {
        id: '2',
        title: '점심 미팅',
        date: '2024-03-15',
        startTime: '12:00',
        endTime: '13:00',
      },
    ];

    const newEvent: EventForm = {
      title: '오후 미팅',
      date: '2024-03-15',
      startTime: '14:00',
      endTime: '15:00',
    };

    const overlappingEvents = findOverlappingEvents(newEvent, events);

    expect(overlappingEvents).toEqual([]);
  });
});
