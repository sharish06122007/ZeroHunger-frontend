import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-secure-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-[500px] bg-[var(--bg-surface)] rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <!-- Header -->
      <div class="px-4 py-3 bg-emerald-600 text-white flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 class="font-medium text-lg">Secure Order Chat</h3>
        </div>
        <span class="text-xs bg-emerald-700 px-2 py-1 rounded-full border border-emerald-500">Private</span>
      </div>
      
      <!-- Messages Area -->
      <div class="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
        <div *ngFor="let msg of messages" 
             class="flex" [ngClass]="{'justify-end': msg.senderId === currentUserId, 'justify-start': msg.senderId !== currentUserId}">
          <div [ngClass]="{'bg-emerald-100 text-emerald-900 rounded-br-none': msg.senderId === currentUserId, 'bg-[var(--bg-surface)] border border-gray-200 text-gray-800 rounded-bl-none': msg.senderId !== currentUserId}"
               class="max-w-[75%] rounded-2xl px-4 py-2 shadow-sm">
            <p class="text-sm">{{ msg.text }}</p>
            <p class="text-[10px] text-gray-500 mt-1 text-right">{{ msg.timestamp | date:'shortTime' }}</p>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="p-3 bg-[var(--bg-surface)] border-t border-gray-200">
        <form (ngSubmit)="sendMessage()" class="flex space-x-2">
          <input type="text" [(ngModel)]="newMessage" name="newMessage" placeholder="Type a message..." 
            class="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm">
          <button type="submit" [disabled]="!newMessage.trim()" 
            class="bg-emerald-600 text-white rounded-full p-2 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition">
            <svg class="h-5 w-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  `
})
export class SecureChatComponent implements OnInit, OnDestroy {
  @Input() orderId!: string;
  @Input() currentUserId!: string;
  
  messages: any[] = [];
  newMessage = '';
  private sub!: Subscription;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // Load history
    this.chatService.getChatHistory(this.orderId).subscribe({
      next: (res) => {
        this.messages = res.data.messages || [];
      },
      error: (err) => console.error(err)
    });

    // Connect to socket room
    this.chatService.connect(this.orderId);
    
    // Listen for new messages
    this.sub = this.chatService.onReceiveMessage().subscribe(msg => {
      this.messages.push(msg);
      // Here we would normally scroll to bottom
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.orderId, this.currentUserId, this.newMessage);
      this.newMessage = '';
    }
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
    this.chatService.disconnect();
  }
}
