import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;
  readonly isConnected = signal<boolean>(false);
  private eventSubject = new Subject<{ event: string; data: any }>();

  constructor() {
    this.connect();
  }

  private connect(): void {
    const socketUrl = environment.apiUrl.replace('/api/v1', '');
    this.socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('⚡ Socket.IO Connected:', this.socket.id);
      this.isConnected.set(true);
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Socket.IO Disconnected');
      this.isConnected.set(false);
    });

    // Listen to generic broadcasts
    const events = [
      'food:created',
      'food:updated',
      'food:deleted',
      'request:created',
      'request:updated',
      'mission:accepted',
      'mission:delivered',
      'analytics:update',
      'notification:new',
    ];

    events.forEach((evt) => {
      this.socket.on(evt, (data: any) => {
        this.eventSubject.next({ event: evt, data });
      });
    });
  }

  onEvent(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      const handler = (data: any) => subscriber.next(data);
      this.socket.on(eventName, handler);
      return () => this.socket.off(eventName, handler);
    });
  }

  get eventStream$(): Observable<{ event: string; data: any }> {
    return this.eventSubject.asObservable();
  }

  joinRoom(room: string): void {
    if (this.socket) {
      this.socket.emit('join_room', room);
    }
  }

  leaveRoom(room: string): void {
    if (this.socket) {
      this.socket.emit('leave_room', room);
    }
  }
}
