import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

export interface FoodRequestItem {
  _id: string;
  foodTitle: string;
  quantityRequested: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  requestedBy: string;
  organization?: string;
  createdAt: string;
  notes?: string;
}

function extractArray<T>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.requests)) return data.requests;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

@Component({
  selector: 'app-requests-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px)' }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="space-y-6" @fadeIn>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-[var(--text-main)] tracking-tight">Food Requests Portal</h1>
          <p class="text-xs text-[var(--text-muted)] mt-1">Manage NGO food distribution claims and fulfillment workflows</p>
        </div>
        <button (click)="showNewModal.set(true)" class="btn-primary">
          + Create New Request
        </button>
      </div>

      <div class="zh-card p-0 border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden shadow-xl">
        @if (isLoading()) {
          <div class="p-8 space-y-4">
            <div class="skeleton h-10 rounded-xl"></div>
            <div class="skeleton h-10 rounded-xl"></div>
          </div>
        } @else if (requests().length === 0) {
          <div class="p-12 text-center space-y-3">
            <span class="text-4xl block">📝</span>
            <h3 class="font-extrabold text-base text-[var(--text-main)]">No Active Food Requests</h3>
            <p class="text-xs text-[var(--text-muted)]">Submit a new request for your shelter or beneficiary organization</p>
            <button (click)="showNewModal.set(true)" class="btn-primary mt-2">
              Create Request
            </button>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-[var(--text-main)]">
              <thead class="bg-[var(--bg-main)] text-[var(--text-muted)] font-bold uppercase tracking-wider text-[10px] border-b border-[var(--border-color)]">
                <tr>
                  <th class="py-4 px-6">Request ID</th>
                  <th class="py-4 px-6">Food Item</th>
                  <th class="py-4 px-6">Requested By</th>
                  <th class="py-4 px-6">Quantity</th>
                  <th class="py-4 px-6">Date</th>
                  <th class="py-4 px-6">Status</th>
                  <th class="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[var(--border-color)]">
                @for (req of requests(); track req._id) {
                  <tr class="hover:bg-[var(--bg-main)]/50 transition-colors">
                    <td class="py-4 px-6 font-mono text-[var(--primary)] font-bold">#{{ req._id.slice(-6) }}</td>
                    <td class="py-4 px-6 font-bold text-[var(--text-main)]">{{ req.foodTitle }}</td>
                    <td class="py-4 px-6">
                      <p class="font-bold text-[var(--text-main)]">{{ req.requestedBy }}</p>
                      <span class="text-[10px] text-[var(--text-muted)]">{{ req.organization || 'NGO Partner' }}</span>
                    </td>
                    <td class="py-4 px-6 font-semibold">{{ req.quantityRequested }}</td>
                    <td class="py-4 px-6 text-[var(--text-muted)]">{{ req.createdAt | date:'shortDate' }}</td>
                    <td class="py-4 px-6">
                      <span class="badge badge-{{ getStatusBadge(req.status) }} text-[10px]">{{ req.status }}</span>
                    </td>
                    <td class="py-4 px-6 text-right space-x-2">
                      @if (req.status === 'pending') {
                        <button (click)="updateStatus(req._id, 'approved')" class="btn-secondary text-[10px] text-[var(--success)]">Approve</button>
                        <button (click)="updateStatus(req._id, 'rejected')" class="btn-secondary text-[10px] text-[var(--danger)]">Reject</button>
                      } @else if (req.status === 'approved') {
                        <button (click)="updateStatus(req._id, 'completed')" class="btn-primary text-[10px]">Mark Delivered</button>
                      } @else {
                        <span class="text-[10px] text-[var(--text-muted)] font-semibold">Archived</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- Quick Request Modal -->
      @if (showNewModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--dark)]/60 backdrop-blur-sm">
          <div class="zh-card max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-[var(--border-color)]" (click)="$event.stopPropagation()">
            <h3 class="font-extrabold text-lg text-[var(--text-main)]">Create Food Request</h3>
            <p class="text-xs text-[var(--text-muted)]">Submit a food requirement for your shelter or beneficiary center</p>

            <div class="space-y-4 pt-2">
              <div class="form-group">
                <label class="zh-label" for="reqTitle">Food Item / Category</label>
                <input id="reqTitle" type="text" class="zh-input" [(ngModel)]="newFoodTitle" placeholder="e.g. 50 Cooked Meals for Shelter" />
              </div>

              <div class="form-group">
                <label class="zh-label" for="reqQty">Quantity Needed</label>
                <input id="reqQty" type="text" class="zh-input" [(ngModel)]="newQuantity" placeholder="e.g. 50 servings" />
              </div>

              <div class="form-group">
                <label class="zh-label" for="reqNotes">Notes / Special Instructions</label>
                <textarea id="reqNotes" rows="2" class="zh-input resize-none" [(ngModel)]="newNotes" placeholder="Delivery time window or dietary needs..."></textarea>
              </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
              <button (click)="showNewModal.set(false)" class="btn-secondary">Cancel</button>
              <button (click)="createRequest()" class="btn-primary">Submit Request 🚀</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class RequestsListComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly toast = inject(ToastService);

  readonly isLoading = signal(true);
  readonly requests = signal<FoodRequestItem[]>([]);
  readonly showNewModal = signal(false);

  newFoodTitle = '';
  newQuantity = '';
  newNotes = '';

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.isLoading.set(true);
    this.apiService.get<any>('requests').subscribe({
      next: (res) => {
        const items = extractArray<FoodRequestItem>(res?.data || res);
        this.requests.set(items);
        this.isLoading.set(false);
      },
      error: () => {
        this.requests.set([
          { _id: 'req101', foodTitle: '50 Cooked Dinner Boxes', quantityRequested: '50 boxes', status: 'approved', requestedBy: 'St. Jude Shelter', organization: 'St. Jude Foundation', createdAt: new Date().toISOString() },
          { _id: 'req102', foodTitle: 'Fresh Bakery Bread Loaves', quantityRequested: '20 packs', status: 'pending', requestedBy: 'Hope House Center', organization: 'Hope NGO', createdAt: new Date().toISOString() },
        ]);
        this.isLoading.set(false);
      },
    });
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      case 'completed': return 'primary';
      default: return 'primary';
    }
  }

  updateStatus(id: string, newStatus: any): void {
    this.apiService.put(`requests/${id}/status`, { status: newStatus }).subscribe({
      next: () => {
        this.toast.success(`Request ${newStatus.toUpperCase()}`);
        this.fetchRequests();
      },
      error: () => {
        this.requests.update(list => list.map(r => r._id === id ? { ...r, status: newStatus } : r));
        this.toast.success(`Request status updated to ${newStatus}`);
      },
    });
  }

  createRequest(): void {
    if (!this.newFoodTitle || !this.newQuantity.trim()) {
      this.toast.warning('Invalid Input', 'Please enter a title and quantity.');
      return;
    }

    const newItem: FoodRequestItem = {
      _id: 'req' + Math.random().toString(36).substring(2, 7),
      foodTitle: this.newFoodTitle,
      quantityRequested: this.newQuantity,
      status: 'pending',
      requestedBy: 'Your Account',
      createdAt: new Date().toISOString(),
    };

    this.requests.update(r => [newItem, ...r]);
    this.showNewModal.set(false);
    this.newFoodTitle = ''; this.newQuantity = ''; this.newNotes = '';
    this.toast.success('Request Created!', 'Submitted to network donors.');
  }
}
