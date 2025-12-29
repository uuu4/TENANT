import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface NewsItem {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    categoryColor: string;
    image: string;
}

@Component({
    selector: 'app-news',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <section class="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-4xl font-bold mb-4">Haberler & Duyurular</h1>
          <p class="text-xl text-primary-100">En son gelişmeler ve kampanyalardan haberdar olun</p>
        </div>
      </section>

      <!-- Announcements Banner -->
      <section class="bg-gradient-to-r from-yellow-400 to-orange-400 py-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-center gap-3 text-gray-900">
            <span class="animate-pulse">📢</span>
            <span class="font-semibold">Yeni yıl kampanyamız başladı! Tüm siparişlerde %10 indirim.</span>
            <a routerLink="/products" class="underline font-bold hover:no-underline">Hemen İncele →</a>
          </div>
        </div>
      </section>

      <!-- News Grid -->
      <section class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (news of newsItems; track news.id) {
              <article class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <!-- Image Placeholder -->
                <div class="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center group-hover:from-primary-100 group-hover:to-primary-200 transition-colors">
                  <span class="text-6xl">{{ news.image }}</span>
                </div>
                
                <div class="p-6">
                  <div class="flex items-center gap-3 mb-3">
                    <span [class]="'px-3 py-1 text-xs font-medium rounded-full ' + news.categoryColor">
                      {{ news.category }}
                    </span>
                    <span class="text-sm text-gray-500">{{ news.date }}</span>
                  </div>
                  
                  <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {{ news.title }}
                  </h3>
                  
                  <p class="text-gray-600 text-sm mb-4">
                    {{ news.excerpt }}
                  </p>
                  
                  <a href="#" class="text-primary-600 font-medium text-sm hover:text-primary-700 inline-flex items-center gap-1">
                    Devamını Oku
                    <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </a>
                </div>
              </article>
            }
          </div>
        </div>
      </section>

      <!-- Newsletter Section -->
      <section class="py-16 bg-white">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-3xl p-10 border border-primary-100">
            <h2 class="text-2xl font-bold text-gray-900 mb-3">Bültenimize Abone Olun</h2>
            <p class="text-gray-600 mb-6">Kampanya ve fırsatlardan ilk siz haberdar olun</p>
            
            <div class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="E-posta adresiniz" 
                class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <button class="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors">
                Abone Ol
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class NewsComponent {
    newsItems: NewsItem[] = [
        {
            id: 1,
            title: 'Yeni Ürün Kategorileri Eklendi',
            excerpt: 'Endüstriyel ekipmanlar ve yedek parça kategorilerimiz genişledi. Binlerce yeni ürün sizi bekliyor.',
            date: '28 Aralık 2024',
            category: 'Ürün',
            categoryColor: 'bg-blue-100 text-blue-700',
            image: '📦'
        },
        {
            id: 2,
            title: 'Kargo Anlaşması Güncellendi',
            excerpt: '500₺ üzeri siparişlerde ücretsiz kargo kampanyamız devam ediyor. Hızlı teslimat garantisi.',
            date: '25 Aralık 2024',
            category: 'Kampanya',
            categoryColor: 'bg-green-100 text-green-700',
            image: '🚚'
        },
        {
            id: 3,
            title: 'Yeni Ödeme Seçenekleri',
            excerpt: 'Artık 6 aya varan taksit seçenekleri ve havale/EFT ile extra indirim fırsatları sunuyoruz.',
            date: '20 Aralık 2024',
            category: 'Duyuru',
            categoryColor: 'bg-purple-100 text-purple-700',
            image: '💳'
        },
        {
            id: 4,
            title: 'Yılbaşı İndirimleri Başladı',
            excerpt: 'Seçili ürünlerde %30\'a varan indirimler! Yılbaşı öncesi stoklarınızı tamamlayın.',
            date: '15 Aralık 2024',
            category: 'Kampanya',
            categoryColor: 'bg-green-100 text-green-700',
            image: '🎄'
        },
        {
            id: 5,
            title: 'Müşteri Destek Hattımız 7/24',
            excerpt: 'Artık hafta sonu ve tatil günlerinde de destek ekibimize ulaşabilirsiniz.',
            date: '10 Aralık 2024',
            category: 'Duyuru',
            categoryColor: 'bg-purple-100 text-purple-700',
            image: '📞'
        },
        {
            id: 6,
            title: 'Mobil Uygulama Yakında',
            excerpt: 'iOS ve Android için mobil uygulamamız çok yakında. Bildirim almak için kayıt olun.',
            date: '5 Aralık 2024',
            category: 'Teknoloji',
            categoryColor: 'bg-orange-100 text-orange-700',
            image: '📱'
        }
    ];
}
