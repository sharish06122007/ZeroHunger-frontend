import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ChartBarItem {
  label: string;
  value: number;
  color?: string;
}

@Component({
  selector: 'app-analytics-charts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      @if (chartType === 'area' || chartType === 'line') {
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-extrabold text-sm text-[#1A1A1A]">{{ title }}</h4>
            <span class="text-xs font-semibold text-[#7743DB]">Live Aggregation</span>
          </div>
          <div class="h-44 w-full relative pt-4">
            <svg viewBox="0 0 500 120" class="w-full h-full overflow-visible">
              <defs>
                <linearGradient [id]="gradientId" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#7743DB" stop-opacity="0.4"/>
                  <stop offset="100%" stop-color="#7743DB" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path [attr.d]="areaPath" [attr.fill]="'url(#' + gradientId + ')'" />
              <path [attr.d]="linePath" fill="none" stroke="#7743DB" stroke-width="3" stroke-linecap="round"/>
              @for (pt of points; track $index) {
                <circle [attr.cx]="pt.x" [attr.cy]="pt.y" r="5" fill="#7743DB" class="hover:r-7 transition-all cursor-pointer"/>
              }
            </svg>
            <div class="flex justify-between text-[10px] font-bold text-[#5B5B6A] pt-2">
              @for (item of data; track item.label) {
                <span>{{ item.label }}</span>
              }
            </div>
          </div>
        </div>
      }

      @if (chartType === 'bar') {
        <div class="space-y-3">
          <h4 class="font-extrabold text-sm text-[#1A1A1A]">{{ title }}</h4>
          <div class="space-y-2.5">
            @for (item of data; track item.label) {
              <div class="space-y-1">
                <div class="flex justify-between text-xs font-bold text-[#1A1A1A]">
                  <span class="capitalize">{{ item.label }}</span>
                  <span>{{ item.value }}</span>
                </div>
                <div class="w-full bg-[#F7EFE5] h-3 rounded-full overflow-hidden p-0.5 border border-[#E8DDD3]">
                  <div
                    class="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#7743DB] to-[#C3ACD0]"
                    [style.width.%]="getPercentage(item.value)"
                  ></div>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class AnalyticsChartsComponent {
  @Input() title = 'Analytics Trend';
  @Input() chartType: 'line' | 'area' | 'bar' = 'bar';
  @Input() data: ChartBarItem[] = [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 24 },
    { label: 'Wed', value: 18 },
    { label: 'Thu', value: 32 },
    { label: 'Fri', value: 45 },
    { label: 'Sat', value: 28 },
    { label: 'Sun', value: 38 },
  ];

  gradientId = 'chart-grad-' + Math.random().toString(36).substring(2, 7);

  get maxValue(): number {
    return Math.max(...this.data.map(d => d.value), 1);
  }

  getPercentage(val: number): number {
    return Math.round((val / this.maxValue) * 100);
  }

  get points(): { x: number; y: number }[] {
    const width = 500;
    const height = 100;
    const step = width / Math.max(this.data.length - 1, 1);
    return this.data.map((d, i) => ({
      x: i * step,
      y: height - (d.value / this.maxValue) * (height - 20),
    }));
  }

  get linePath(): string {
    const pts = this.points;
    if (pts.length === 0) return '';
    return pts.reduce((acc, pt, i) => (i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`), '');
  }

  get areaPath(): string {
    const pts = this.points;
    if (pts.length === 0) return '';
    const line = this.linePath;
    const lastX = pts[pts.length - 1].x;
    return `${line} L ${lastX},120 L 0,120 Z`;
  }
}
