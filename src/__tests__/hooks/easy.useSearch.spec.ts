import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch';
import { Event } from '../../types';

describe('useSearch', () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '주간 회의',
      description: '팀 회의',
      location: '회의실 A',
      date: '2024-03-15',
      startTime: '10:00',
      endTime: '11:00',
      category: '회의',
      notificationTime: 30,
      repeat: { type: 'none', interval: 0 },
    },
    {
      id: '2',
      title: '점심 식사',
      description: '팀 점심',
      location: '구내식당',
      date: '2024-03-15',
      startTime: '12:00',
      endTime: '13:00',
      category: '회식',
      notificationTime: 30,
      repeat: { type: 'none', interval: 0 },
    },
    {
      id: '3',
      title: '월간 미팅',
      description: '월간 실적 회의',
      location: '회의실 B',
      date: '2024-03-30',
      startTime: '14:00',
      endTime: '15:00',
      category: '회의',
      notificationTime: 30,
      repeat: { type: 'none', interval: 0 },
    },
  ];

  const currentDate = new Date('2024-03-15');

  it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
    const { result } = renderHook(() => useSearch(mockEvents, currentDate, 'month'));

    expect(result.current.searchTerm).toBe('');
    expect(result.current.filteredEvents).toHaveLength(3);
    expect(result.current.filteredEvents).toEqual(mockEvents);
  });

  it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
    const { result } = renderHook(() => useSearch(mockEvents, currentDate, 'month'));

    act(() => {
      result.current.setSearchTerm('회의');
    });

    expect(result.current.filteredEvents).toHaveLength(2);
    expect(result.current.filteredEvents.map((e) => e.id)).toEqual(['1', '3']);
  });

  it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
    const { result } = renderHook(() => useSearch(mockEvents, currentDate, 'month'));

    act(() => {
      result.current.setSearchTerm('팀');
    });

    expect(result.current.filteredEvents).toHaveLength(2);
    expect(result.current.filteredEvents.map((e) => e.id)).toEqual(['1', '2']);
  });

  it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
    const { result: weekResult } = renderHook(() => useSearch(mockEvents, currentDate, 'week'));

    expect(weekResult.current.filteredEvents).toHaveLength(2);
    expect(weekResult.current.filteredEvents.map((e) => e.id)).toEqual(['1', '2']);

    const { result: monthResult } = renderHook(() => useSearch(mockEvents, currentDate, 'month'));

    expect(monthResult.current.filteredEvents).toHaveLength(3);
  });

  it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
    const { result } = renderHook(() => useSearch(mockEvents, currentDate, 'month'));

    act(() => {
      result.current.setSearchTerm('회의');
    });
    expect(result.current.filteredEvents).toHaveLength(2);
    expect(result.current.filteredEvents[0].title).toBe('주간 회의');

    act(() => {
      result.current.setSearchTerm('점심');
    });
    expect(result.current.filteredEvents).toHaveLength(1);
    expect(result.current.filteredEvents[0].title).toBe('점심 식사');
  });
});
