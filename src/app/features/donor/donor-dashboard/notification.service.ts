import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  getNotifications() {
    return [
      { title: 'Volunteer accepted pickup', time: '2 min ago', unread: true },
      { title: 'Impact milestone reached', time: '24 min ago', unread: false },
      { title: 'New NGO partner added', time: '1 hr ago', unread: false },
    ];
  }
}
