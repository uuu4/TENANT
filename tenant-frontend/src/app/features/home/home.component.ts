import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen">
      <!-- Hero Section -->
      <section class="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 20px 20px;"></div>
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div class="text-center max-w-4xl mx-auto">
            <span class="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
              🚀 B2B Toptan Satış Platformu
            </span>
            <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              İşletmeniz İçin
              <span class="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Profesyonel Tedarik
              </span>
              Çözümleri
            </h1>
            <p class="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Binlerce ürün, rekabetçi toptan fiyatlar ve hızlı teslimat ile işletmenizi büyütün.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a routerLink="/products" 
                 class="px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                Ürünleri İncele
              </a>
              <a routerLink="/info" 
                 class="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all">
                Daha Fazla Bilgi
              </a>
            </div>
          </div>
        </div>
        
        <!-- Wave SVG -->
        <div class="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Neden Bizi Tercih Etmelisiniz?</h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">B2B ihtiyaçlarınız için en kapsamlı çözüm</p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <!-- Feature 1 -->
            <div class="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Toptan Fiyatlar</h3>
              <p class="text-gray-600">Özel B2B fiyatlandırma ile maliyetlerinizi düşürün</p>
            </div>

            <!-- Feature 2 -->
            <div class="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Hızlı Teslimat</h3>
              <p class="text-gray-600">24-48 saat içinde kapınızda</p>
            </div>

            <!-- Feature 3 -->
            <div class="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Güvenli Alışveriş</h3>
              <p class="text-gray-600">%100 güvenli ödeme altyapısı</p>
            </div>

            <!-- Feature 4 -->
            <div class="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">7/24 Destek</h3>
              <p class="text-gray-600">Her zaman yanınızdayız</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div class="text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <div class="text-primary-200">Aktif Ürün</div>
            </div>
            <div>
              <div class="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div class="text-primary-200">Marka</div>
            </div>
            <div>
              <div class="text-4xl md:text-5xl font-bold mb-2">2K+</div>
              <div class="text-primary-200">İş Ortağı</div>
            </div>
            <div>
              <div class="text-4xl md:text-5xl font-bold mb-2">99%</div>
              <div class="text-primary-200">Müşteri Memnuniyeti</div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-20 bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hemen Başlayın</h2>
          <p class="text-xl text-gray-600 mb-8">
            Hesabınıza giriş yapın ve avantajlı fiyatlarla alışverişe başlayın
          </p>
          <a routerLink="/login" 
             class="inline-block px-10 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all transform hover:scale-105 shadow-lg">
            Giriş Yap
          </a>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-gray-900 text-gray-400 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid md:grid-cols-4 gap-8">
            <div>
              <div class="flex items-center gap-2 mb-4">
                <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold text-lg">B2B</span>
                </div>
                <span class="text-xl font-bold text-white">TenantApp</span>
              </div>
              <p class="text-sm">B2B ihtiyaçlarınız için güvenilir tedarik platformu</p>
            </div>
            <div>
              <h4 class="text-white font-semibold mb-4">Hızlı Linkler</h4>
              <ul class="space-y-2 text-sm">
                <li><a routerLink="/products" class="hover:text-white transition-colors">Ürünler</a></li>
                <li><a routerLink="/news" class="hover:text-white transition-colors">Haberler</a></li>
                <li><a routerLink="/info" class="hover:text-white transition-colors">Hakkımızda</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-white font-semibold mb-4">Destek</h4>
              <ul class="space-y-2 text-sm">
                <li><a href="#" class="hover:text-white transition-colors">SSS</a></li>
                <li><a href="#" class="hover:text-white transition-colors">İletişim</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Kargo Takip</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-white font-semibold mb-4">İletişim</h4>
              <ul class="space-y-2 text-sm">
                <li>📧 info&#64;b2bplatform.com</li>
                <li>📞 +90 (212) 555 00 00</li>
                <li>📍 İstanbul, Türkiye</li>
              </ul>
            </div>
          </div>
          <div class="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2024 B2B Platform. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class HomeComponent { }
