import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

describe('getFilteredEvents', () => {
  const baseEvents: Event[] = [
    {
      id: '1',
      title: '이벤트 1',
      description: '첫 번째 이벤트',
      location: '회의실 A',
      date: '2024-07-01',
      startTime: '10:00',
      endTime: '11:00',
      category: '회의',
      notificationTime: 30,
      repeat: { type: 'none', interval: 0 },
    },
    {
      id: '2',
      title: '이벤트 2',
      description: '두 번째 이벤트',
      location: '회의실 B',
      date: '2024-07-03',
      startTime: '14:00',
      endTime: '15:00',
      category: '회의',
      notificationTime: 30,
      repeat: { type: 'none', interval: 0 },
    },
    {
      id: '3',
      title: '미팅',
      description: '세 번째 이벤트',
      location: '회의실 C',
      date: '2024-07-31',
      startTime: '16:00',
      endTime: '17:00',
      category: '회의',
      notificationTime: 30,
      repeat: { type: 'none', interval: 0 },
    },
  ];

  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    const result = getFilteredEvents(baseEvents, '이벤트 2', new Date('2024-07-01'), 'month');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('이벤트 2');
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    const result = getFilteredEvents(baseEvents, '', new Date('2024-07-01'), 'week');
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toEqual(['1', '2']);
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    const result = getFilteredEvents(baseEvents, '', new Date('2024-07-15'), 'month');
    expect(result).toHaveLength(3);
    expect(result.map((e) => e.id)).toEqual(['1', '2', '3']);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const result = getFilteredEvents(baseEvents, '이벤트', new Date('2024-07-01'), 'week');
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toEqual(['1', '2']);
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    const result = getFilteredEvents(baseEvents, '', new Date('2024-07-01'), 'month');
    expect(result).toHaveLength(3);
    expect(result.map((e) => e.id)).toEqual(['1', '2', '3']);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const eventsWithMixedCase = [
      {
        ...baseEvents[0],
        title: 'EVENT 1',
        description: 'First EVENT',
      },
      {
        ...baseEvents[1],
        title: 'event 2',
        description: 'Second event',
      },
    ];
    const result = getFilteredEvents(eventsWithMixedCase, 'eVeNt', new Date('2024-07-01'), 'month');
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toEqual(['1', '2']);
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const eventsWithBoundary = [
      ...baseEvents,
      {
        ...baseEvents[0],
        id: '4',
        date: '2024-08-01',
        title: '다음 달 이벤트',
      },
    ];
    const result = getFilteredEvents(eventsWithBoundary, '', new Date('2024-07-15'), 'month');
    expect(result).toHaveLength(3);
    expect(result.map((e) => e.id)).not.toContain('4');
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const result = getFilteredEvents([], '', new Date('2024-07-01'), 'week');
    expect(result).toHaveLength(0);
  });
});
