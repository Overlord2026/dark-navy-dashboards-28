// PWA utility functions
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  }
};

export const promptInstallPWA = () => {
  let deferredPrompt: any;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button/banner
    const installBanner = document.createElement('div');
    installBanner.innerHTML = `
      <div class="fixed bottom-4 left-4 right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg z-50">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold">Install Family Office Marketplace</h3>
            <p class="text-sm opacity-90">Add to home screen for quick access</p>
          </div>
          <div class="flex gap-2">
            <button id="install-btn" class="bg-white text-primary px-3 py-1 rounded text-sm font-medium">
              Install
            </button>
            <button id="dismiss-btn" class="opacity-70 hover:opacity-100">✕</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(installBanner);
    
    document.getElementById('install-btn')?.addEventListener('click', () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        deferredPrompt = null;
        installBanner.remove();
      });
    });
    
    document.getElementById('dismiss-btn')?.addEventListener('click', () => {
      installBanner.remove();
    });
  });
};