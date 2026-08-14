import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, HeartHandshake, Utensils, PackagePlus, Users, ShieldCheck, Lock, UsersRound, Eye, Heart, Smartphone, Network, Truck, Clock, Building2, Handshake, ArrowRight, Quote, UtensilsCrossed, ArrowDown, MapPin, UserCheck, Settings } from 'lucide-angular';
import { GradientShimmerComponent } from '../../shared/components/gradient-shimmer/gradient-shimmer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    LucideAngularModule,
    GradientShimmerComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  readonly HeartHandshake = HeartHandshake;
  readonly Utensils = Utensils;
  readonly PackagePlus = PackagePlus;
  readonly Users = Users;
  readonly ShieldCheck = ShieldCheck;
  readonly Lock = Lock;
  readonly UsersRound = UsersRound;
  readonly Eye = Eye;
  readonly Heart = Heart;
  readonly Smartphone = Smartphone;
  readonly Network = Network;
  readonly Truck = Truck;
  readonly Clock = Clock;
  readonly Building2 = Building2;
  readonly Handshake = Handshake;
  readonly ArrowRight = ArrowRight;
  readonly Quote = Quote;
  readonly UtensilsCrossed = UtensilsCrossed;
  readonly ArrowDown = ArrowDown;
  readonly MapPin = MapPin;
  readonly UserCheck = UserCheck;
  readonly Settings = Settings;
}
