import { act, renderHook } from '@testing-library/react';
import { useSearch } from '../../hooks/useSearch';
import { Event } from '../../types';

const mockEvents: Event[] = [
  {
    id: '1',
    title: '주간 회의',
    description: '팀 업무 논의',
    location: '회의실 A',
    start: new Date('2024-01-15T10:00:00'),
    end: new Date('2024-01-15T11:00:00'),
  },
  {
    id: '2',
    title: '점심 식사',
    description: '팀 회식',
    location: '레스토랑',
    start: new Date('2024-01-15T12:00:00'),
    end: new Date('2024-01-15T13:00:00'),
  },
  {
    id: '3',
    title: '월간 보고',
    description: '월간 실적 보고',
    location: '대회의실',
    start: new Date('2024-02-01T14:00:00'),
    end: new Date('2024-02-01T15:00:00'),
  },
];

const currentDate = new Date('2024-01-15');

it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(mockEvents, currentDate, 'week'));
  expect(result.current.filteredEvents).toEqual(
    expect.arrayContaining(mockEvents.filter(event => event.start.getMonth() === currentDate.getMonth()))
  );
});

it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
  const { result } = renderHook(() => useSearch(mockEvents, currentDate, 'week'));
  
  act(() => {
    result.current.setSearchTerm('회의');
  });

  expect(result.current.filteredEvents).toEqual(
    expect.arrayContaining([mockEvents[0]])
  );
});

it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(mockEvents, currentDate, 'week'));
  
  act(() => {
    result.current.setSearchTerm('레스토랑');
  });

  expect(result.current.filteredEvents).toEqual(
    expect.arrayContaining([mockEvents[1]])
  );
});

it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
  const { result: weekResult } = renderHook(() => 
    useSearch(mockEvents, currentDate, 'week')
  );
  
  const { result: monthResult } = renderHook(() => 
    useSearch(mockEvents, currentDate, 'month')
  );

  expect(weekResult.current.filteredEvents).toHaveLength(2); // 1월 15일 주간 이벤트만
  expect(monthResult.current.filteredEvents).toHaveLength(2); // 1월 이벤트만
});

it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
  const { result } = renderHook(() => useSearch(mockEvents, currentDate, 'week'));
  
  act(() => {
    result.current.setSearchTerm('회의');
  });
  expect(result.current.filteredEvents).toEqual(
    expect.arrayContaining([mockEvents[0]])
  );

  act(() => {
    result.current.setSearchTerm('점심');
  });
  expect(result.current.filteredEvents).toEqual(
    expect.arrayContaining([mockEvents[1]])
  );
});