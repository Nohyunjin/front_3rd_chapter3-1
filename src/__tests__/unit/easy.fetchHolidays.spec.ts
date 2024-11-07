import { fetchHolidays } from '../../apis/fetchHolidays';

describe('fetchHolidays', () => {
  it('공휴일이 없는 월에 대해 빈 객체를 반환한다', () => {
    // 4월은 공휴일이 없음
    const date = new Date('2024-04-15');
    const result = fetchHolidays(date);

    expect(result).toEqual({});
  });

  it('여러 공휴일이 있는 월에 대해 모든 공휴일을 반환한다', () => {
    // 9월은 추석 연휴로 3일의 공휴일이 있음
    const date = new Date('2024-09-15');
    const result = fetchHolidays(date);

    expect(result).toEqual({
      '2024-09-16': '추석',
      '2024-09-17': '추석',
      '2024-09-18': '추석',
    });
  });
});
