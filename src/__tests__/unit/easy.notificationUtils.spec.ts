import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

describe('getUpcomingEvents', () => {
  const baseEvent: Event = {
    id: '1',
    title: '미팅',
    date: '2024-01-15',
    startTime: '14:00',
    endTime: '15:00',
    description: '팀 미팅',
    location: '회의실',
    category: '회의',
    notificationTime: 30,
    repeat: {
      type: 'none',
      interval: 0,
    },
  };

  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const events = [
      {
        ...baseEvent,
        id: '1',
        startTime: '14:00',
        notificationTime: 30,
      },
    ];

    // 이벤트 시작 30분 전
    const now = new Date('2024-01-15T13:30:00');
    const result = getUpcomingEvents(events, now, []);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const events = [
      {
        ...baseEvent,
        id: '1',
        startTime: '14:00',
        notificationTime: 30,
      },
    ];

    const now = new Date('2024-01-15T13:30:00');
    const notifiedEvents = ['1'];
    const result = getUpcomingEvents(events, now, notifiedEvents);

    expect(result).toHaveLength(0);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const events = [
      {
        ...baseEvent,
        id: '1',
        startTime: '14:00',
        notificationTime: 30,
      },
    ];

    // 이벤트 시작 40분 전
    const now = new Date('2024-01-15T13:20:00');
    const result = getUpcomingEvents(events, now, []);

    expect(result).toHaveLength(0);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const events = [
      {
        id: '1',
        title: '미팅',
        date: '2024-11-07',
        startTime: '14:00',
        endTime: '15:00',
        description: '팀 미팅',
        location: '회의실',
        category: '회의',
        notificationTime: 10,
        repeat: {
          type: 'none',
          interval: 0,
        },
      },
    ];

    const now = new Date('2024-11-07T13:40:00');

    const result = getUpcomingEvents(events, now, []);

    expect(result).toHaveLength(0);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const event: Event = {
      id: '1',
      title: '중요 미팅',
      date: '2024-01-15',
      startTime: '14:00',
      endTime: '15:00',
      description: '팀 미팅',
      location: '회의실',
      category: '회의',
      notificationTime: 30,
      repeat: {
        type: 'none',
        interval: 0,
      },
    };

    const message = createNotificationMessage(event);
    expect(message).toBe('30분 후 중요 미팅 일정이 시작됩니다.');
  });
});
