import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface FaqItem {
    question: string;
    answer: string;
}

@Component({
    selector: 'app-info',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <section class="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-4xl font-bold mb-4">Hakkımızda</h1>
          <p class="text-xl text-primary-100">B2B platformumuz ve hizmetlerimiz hakkında bilgi alın</p>
        </div>
      </section>

      <!-- About Section -->
      <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span class="text-primary-600 font-semibold text-sm uppercase tracking-wide">Biz Kimiz?</span>
              <h2 class="text-3xl font-bold text-gray-900 mt-2 mb-6">Türkiye'nin Güvenilir B2B Tedarik Platformu</h2>
              <p class="text-gray-600 mb-4">
                2020 yılından bu yana işletmelerin tedarik süreçlerini dijitalleştiriyor ve kolaylaştırıyoruz. 
                Geniş ürün yelpazemiz, rekabetçi fiyatlarımız ve güvenilir hizmet anlayışımızla binlerce iş ortağına hizmet veriyoruz.
              </p>
              <p class="text-gray-600 mb-6">
                Müşteri memnuniyetini en ön planda tutarak, hızlı teslimat ve 7/24 destek hizmetleriyle 
                işletmelerin yanında olmaya devam ediyoruz.
              </p>
              <div class="flex flex-wrap gap-4">
                <div class="flex items-center gap-2 text-gray-700">
                  <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span>Lisanslı İşletme</span>
                </div>
                <div class="flex items-center gap-2 text-gray-700">
                  <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span>SSL Güvenlik</span>
                </div>
                <div class="flex items-center gap-2 text-gray-700">
                  <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span>7/24 Destek</span>
                </div>
              </div>
            </div>
            <div class="bg-gradient-to-br from-primary-100 to-primary-50 rounded-3xl p-8 flex items-center justify-center">
              <div class="text-center">
                <div class="w-32 h-32 bg-gradient-to-br from-primary-600 to-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span class="text-white font-bold text-4xl">B2B</span>
                </div>
                <p class="text-primary-700 font-semibold text-lg">İşletmeler için güvenilir tedarik çözümleri</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="py-16">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Sıkça Sorulan Sorular</h2>
            <p class="text-gray-600">Merak ettiğiniz konularda size yardımcı olalım</p>
          </div>

          <div class="space-y-4">
            @for (faq of faqItems; track faq.question; let i = $index) {
              <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button 
                  (click)="toggleFaq(i)"
                  class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span class="font-semibold text-gray-900">{{ faq.question }}</span>
                  <svg 
                    [class]="'w-5 h-5 text-gray-500 transition-transform ' + (openFaq() === i ? 'rotate-180' : '')" 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                @if (openFaq() === i) {
                  <div class="px-6 pb-4 text-gray-600 border-t border-gray-100 pt-4">
                    {{ faq.answer }}
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">İletişim</h2>
            <p class="text-gray-600">Sorularınız için bize ulaşın</p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            <!-- Phone -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-8 text-center border border-blue-100">
              <div class="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <h3 class="font-bold text-gray-900 mb-2">Telefon</h3>
              <p class="text-gray-600">+90 (212) 555 00 00</p>
              <p class="text-gray-500 text-sm mt-1">Hafta içi 09:00 - 18:00</p>
            </div>

            <!-- Email -->
            <div class="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-8 text-center border border-green-100">
              <div class="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 class="font-bold text-gray-900 mb-2">E-posta</h3>
              <p class="text-gray-600">info&#64;b2bplatform.com</p>
              <p class="text-gray-500 text-sm mt-1">24 saat içinde yanıt</p>
            </div>

            <!-- Address -->
            <div class="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-8 text-center border border-purple-100">
              <div class="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <h3 class="font-bold text-gray-900 mb-2">Adres</h3>
              <p class="text-gray-600">Maslak, İstanbul</p>
              <p class="text-gray-500 text-sm mt-1">Türkiye</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Terms Notice -->
      <section class="py-8 bg-gray-100 border-t border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <a href="#" class="hover:text-primary-600 transition-colors">Kullanım Koşulları</a>
            <span class="text-gray-300">|</span>
            <a href="#" class="hover:text-primary-600 transition-colors">Gizlilik Politikası</a>
            <span class="text-gray-300">|</span>
            <a href="#" class="hover:text-primary-600 transition-colors">KVKK Aydınlatma Metni</a>
            <span class="text-gray-300">|</span>
            <a href="#" class="hover:text-primary-600 transition-colors">Çerez Politikası</a>
          </div>
        </div>
      </section>
    </div>
  `
})
export class InfoComponent {
    openFaq = signal<number | null>(null);

    faqItems: FaqItem[] = [
        {
            question: 'Nasıl sipariş verebilirim?',
            answer: 'Hesabınıza giriş yaptıktan sonra ürünleri sepetinize ekleyebilir ve sipariş oluşturabilirsiniz. B2B hesabınız yoksa bizimle iletişime geçerek hesap açtırabilirsiniz.'
        },
        {
            question: 'Minimum sipariş tutarı var mı?',
            answer: 'B2B müşterilerimiz için minimum sipariş tutarımız 500₺\'dir. Bu tutarın altındaki siparişlerde kargo ücreti uygulanmaktadır.'
        },
        {
            question: 'Teslimat süresi ne kadardır?',
            answer: 'Stoklarımızda bulunan ürünler için teslimat süresi 24-48 saattir. Özel sipariş ürünleri için teslimat süresi değişkenlik gösterebilir.'
        },
        {
            question: 'İade ve değişim politikanız nedir?',
            answer: 'Ürünlerimizi teslim aldığınız tarihten itibaren 14 gün içinde iade veya değişim talep edebilirsiniz. Ürünlerin orijinal ambalajında ve kullanılmamış olması gerekmektedir.'
        },
        {
            question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
            answer: 'Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerini sunuyoruz. Kurumsal müşterilerimize vadeli ödeme imkanı da sağlıyoruz.'
        },
        {
            question: 'Toplu sipariş indirimi var mı?',
            answer: 'Evet, sipariş miktarına göre kademeli indirim uygulanmaktadır. Büyük miktarlı siparişler için özel fiyat teklifi almak üzere bizimle iletişime geçebilirsiniz.'
        }
    ];

    toggleFaq(index: number): void {
        this.openFaq.set(this.openFaq() === index ? null : index);
    }
}
