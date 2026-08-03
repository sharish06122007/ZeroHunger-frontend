import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  type: 'food' | 'ngo' | 'volunteer';
  description?: string;
}

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-full min-h-[300px] rounded-3xl overflow-hidden border border-[#E8DDD3] shadow-md">
      <div #mapContainer class="w-full h-full min-h-[300px] z-10"></div>
      @if (isLoading) {
        <div class="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex items-center justify-center text-xs font-bold text-[#7743DB]">
          Loading Map View... 🗺️
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `],
})
export class MapViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @Input() markers: MapMarker[] = [];
  @Input() centerLat = 13.0827;
  @Input() centerLng = 80.2707;
  @Input() zoom = 12;

  isLoading = true;
  private map: any;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  private async initMap(): Promise<void> {
    try {
      const L = await import('leaflet');

      // Inject Leaflet CSS dynamically if not present
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      this.map = L.map(this.mapContainer.nativeElement).setView([this.centerLat, this.centerLng], this.zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);

      this.renderMarkers(L);
      this.isLoading = false;
    } catch (e) {
      console.warn('Leaflet map initialization fallback:', e);
      this.isLoading = false;
    }
  }

  private renderMarkers(L: any): void {
    if (!this.markers || this.markers.length === 0) {
      // Default sample marker
      const marker = L.marker([this.centerLat, this.centerLng]).addTo(this.map);
      marker.bindPopup('<b>Current Service Center</b><br>Chennai, Tamil Nadu').openPopup();
      return;
    }

    this.markers.forEach((m) => {
      const iconEmoji = m.type === 'food' ? '🍱' : m.type === 'ngo' ? '🏢' : '🚴';
      const customIcon = L.divIcon({
        html: `<div style="font-size: 24px; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3));">${iconEmoji}</div>`,
        className: 'custom-leaflet-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker([m.lat, m.lng], { icon: customIcon }).addTo(this.map);
      marker.bindPopup(`<b>${m.title}</b><br>${m.description || m.type.toUpperCase()}`);
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
