import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket!: Socket;
  private apiUrl = `${environment.apiUrl}/chat`;

  constructor(private http: HttpClient) {}

  getChatHistory(orderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${orderId}`);
  }

  connect(orderId: string) {
    this.socket = io(environment.apiUrl.replace('/api/v1', ''));
    this.socket.emit('join_room', `chat_${orderId}`);
  }

  sendMessage(orderId: string, senderId: string, text: string) {
    if (this.socket) {
      this.socket.emit('send_message', { orderId, senderId, text });
    }
  }

  onReceiveMessage(): Observable<any> {
    const subject = new Subject<any>();
    if (this.socket) {
      this.socket.on('receive_message', (message: any) => {
        subject.next(message);
      });
    }
    return subject.asObservable();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
